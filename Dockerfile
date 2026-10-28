# syntax=docker/dockerfile:1
# O build calcula sozinho o ?v= (versao do build para o cache de borda) e a
# constante PROGRESSO_FIM_DOWNLOAD (normaliza a barra de carregamento).
# Fonte editavel: index_.html. O index.html e GERADO aqui — nao editar na mao.
FROM alpine:3 AS calculadora
RUN apk add --no-cache brotli
COPY Build/gat8paciente.data.br /tmp/build.data.br
COPY index_.html /tmp/index_.html
RUN set -e;     V=$(stat -c %s /tmp/build.data.br);     brotli -d /tmp/build.data.br -o /tmp/build.data.bin;     D=$(stat -c %s /tmp/build.data.bin);     CONST=$(awk -v d="$D" -v c="$V" 'BEGIN{printf "%.16f", 0.9*d/(2*c)}');     sed -e "s|\"/gat8paciente.loader.js\"|\"/gat8paciente.loader.js?v=$V\"|g"         -e "s|\"/gat8paciente.data.br\"|\"/gat8paciente.data.br?v=$V\"|g"         -e "s|\"/gat8paciente.framework.js.br\"|\"/gat8paciente.framework.js.br?v=$V\"|g"         -e "s|\"/gat8paciente.wasm.br\"|\"/gat8paciente.wasm.br?v=$V\"|g"         -e "s/?v=[0-9]*/?v=$V/g"         -e "s/PROGRESSO_FIM_DOWNLOAD = [0-9.]*/PROGRESSO_FIM_DOWNLOAD = $CONST/"         /tmp/index_.html > /tmp/index.html;     grep -q "PROGRESSO_FIM_DOWNLOAD = $CONST" /tmp/index.html;     grep -q "?v=$V" /tmp/index.html

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY . /usr/share/nginx/html
COPY --from=calculadora /tmp/index.html /usr/share/nginx/html/index.html
COPY ServiceWorker.canonical.js /usr/share/nginx/html/ServiceWorker.js
EXPOSE 8091
CMD ["nginx", "-g", "daemon off;"]
