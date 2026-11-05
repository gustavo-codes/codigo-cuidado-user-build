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
COPY index_.html /tmp/index_.html
RUN set -e;     mkdir -p /tmp/out;     for f in /tmp/br/*; do brotli -d "$f" -o "/tmp/out/$(basename "$f")"; done;     V=$(stat -c %s /tmp/out/gat8paciente.data.br);     sed -e "s|\"/gat8paciente.loader.js\"|\"/gat8paciente.loader.js?v=$V\"|g"         -e "s|\"/gat8paciente.data.br\"|\"/gat8paciente.data.br?v=$V\"|g"         -e "s|\"/gat8paciente.framework.js.br\"|\"/gat8paciente.framework.js.br?v=$V\"|g"         -e "s|\"/gat8paciente.wasm.br\"|\"/gat8paciente.wasm.br?v=$V\"|g"         -e "s/?v=[0-9]*/?v=$V/g"         /tmp/index_.html > /tmp/index.html;     grep -q "?v=$V" /tmp/index.html

FROM nginx:alpine
# Remove o default.conf da imagem base: incluido antes do nosso (ordem
# alfabetica), ele virava o server padrao da porta 80 e recebia todo o
# trafego com o config generico (octet-stream, sem nossos cache-control).
RUN rm -f /etc/nginx/conf.d/default.conf
# Template: o entrypoint oficial roda envsubst em /etc/nginx/templates/*.template
# e gera o nginx.conf com a porta de $PORT (injetada pela Vercel em runtime).
COPY nginx.conf /etc/nginx/templates/nginx.conf.template
COPY . /usr/share/nginx/html
# Sobrescreve os .br pre-comprimidos pelas versoes descomprimidas (mesmo nome).
COPY --from=calculadora /tmp/out/ /usr/share/nginx/html/Build/
COPY --from=calculadora /tmp/index.html /usr/share/nginx/html/index.html
COPY ServiceWorker.canonical.js /usr/share/nginx/html/ServiceWorker.js
# Fallback para quando ninguem define PORT (ex.: docker run local / Coolify sem a env).
ENV PORT=8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
