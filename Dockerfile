# syntax=docker/dockerfile:1
# O build calcula sozinho o ?v= (versao do build para o cache de borda).
# Fonte editavel: index_.html. O index.html e GERADO aqui — nao editar na mao.
#
# Os .br do Unity sao DESCOMPRIMIDOS aqui e servidos com o mesmo nome (.br) e
# corpo plano: o proxy da Vercel re-comprime qualquer resposta empilhando por
# cima do Content-Encoding de origem, o que corrompia os arquivos pre-comprimidos.
# Sem compressao nossa, a borda (Vercel/Cloudflare) comprime o que quiser e o
# loader da Unity recebe corpo plano, que ele sabe ler.
FROM alpine:3 AS calculadora
RUN apk add --no-cache brotli
COPY Build/gat8paciente.data.br /tmp/br/gat8paciente.data.br
COPY Build/gat8paciente.framework.js.br /tmp/br/gat8paciente.framework.js.br
COPY Build/gat8paciente.wasm.br /tmp/br/gat8paciente.wasm.br
COPY Build/gat8paciente.loader.js /tmp/loader.js
COPY index_.html /tmp/index_.html
# Patch do loader: a borda da Vercel comprime as respostas grandes e as serve
# SEM Content-Length (streaming); sem ele o loader trata o download como "nao
# computavel" e o progresso salta direto para 0.9. O loader passa a aceitar o
# header X-Expected-Length (enviado pelo nginx com o tamanho real do arquivo)
# como tamanho esperado, restaurando o progresso real.
# O ?v= passa a ser tamanho do data + tamanho do loader: qualquer mudanca em
# um dos dois invalida o cache imutavel dos dois.
RUN set -e;     mkdir -p /tmp/out /tmp/nginx;     for f in /tmp/br/*; do brotli -d "$f" -o "/tmp/out/$(basename "$f")"; done;     sed -i -e 's#d=void 0!==a.headers.get("Content-Length")#d=void 0!==a.headers.get("Content-Length")||void 0!==a.headers.get("X-Expected-Length")#' -e 's#if(!t)return 0;#if(!t)return parseInt(e.headers.get("X-Expected-Length"))||0;#' /tmp/loader.js;     grep -q 'X-Expected-Length' /tmp/loader.js;     cp /tmp/loader.js /tmp/out/gat8paciente.loader.js;     DF=$(stat -c %s /tmp/out/gat8paciente.data.br);     FF=$(stat -c %s /tmp/out/gat8paciente.framework.js.br);     WF=$(stat -c %s /tmp/out/gat8paciente.wasm.br);     printf 'location = /Build/gat8paciente.data.br { types { } default_type application/octet-stream; add_header X-Expected-Length %s; add_header Cache-Control "public, max-age=31536000, immutable"; }\nlocation = /Build/gat8paciente.framework.js.br { types { } default_type application/javascript; add_header X-Expected-Length %s; add_header Cache-Control "public, max-age=31536000, immutable"; }\nlocation = /Build/gat8paciente.wasm.br { types { } default_type application/wasm; add_header X-Expected-Length %s; add_header Cache-Control "public, max-age=31536000, immutable"; }\n' "$DF" "$FF" "$WF" > /tmp/nginx/expected-lengths.conf;     V=$(( DF + $(stat -c %s /tmp/loader.js) ));     sed -e "s|\"/gat8paciente.loader.js\"|\"/gat8paciente.loader.js?v=$V\"|g"         -e "s|\"/gat8paciente.data.br\"|\"/gat8paciente.data.br?v=$V\"|g"         -e "s|\"/gat8paciente.framework.js.br\"|\"/gat8paciente.framework.js.br?v=$V\"|g"         -e "s|\"/gat8paciente.wasm.br\"|\"/gat8paciente.wasm.br?v=$V\"|g"         -e "s/?v=[0-9]*/?v=$V/g"         /tmp/index_.html > /tmp/index.html;     grep -q "?v=$V" /tmp/index.html

FROM nginx:alpine
# Remove o default.conf da imagem base: incluido antes do nosso (ordem
# alfabetica), ele virava o server padrao da porta 80 e recebia todo o
# trafego com o config generico (octet-stream, sem nossos cache-control).
RUN rm -f /etc/nginx/conf.d/default.conf
# Template: o entrypoint oficial roda envsubst em /etc/nginx/templates/*.template
# e gera o nginx.conf com a porta de $PORT (injetada pela Vercel em runtime).
COPY nginx.conf /etc/nginx/templates/nginx.conf.template
COPY . /usr/share/nginx/html
# Sobrescreve os .br pre-comprimidos pelas versoes descomprimidas (mesmo nome)
# e o loader.js pela versao patchada.
COPY --from=calculadora /tmp/out/ /usr/share/nginx/html/Build/
# Header X-Expected-Length por arquivo (tamanhos reais calculados no build).
COPY --from=calculadora /tmp/nginx/expected-lengths.conf /etc/nginx/conf.d/expected-lengths.conf
COPY --from=calculadora /tmp/index.html /usr/share/nginx/html/index.html
COPY ServiceWorker.canonical.js /usr/share/nginx/html/ServiceWorker.js
# Fallback para quando ninguem define PORT (ex.: docker run local / Coolify sem a env).
ENV PORT=8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
