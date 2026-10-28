# Pós-build — checklist obrigatório

Toda vez que a Unity gerar um build novo nesta pasta, ANTES de commitar:

1. **ServiceWorker.js**: a Unity SOBRESCREVE este arquivo com o template 0.1.2
   (sem activate, cache-first de tudo). Restaure com:
   ```sh
   cp ServiceWorker.canonical.js ServiceWorker.js
   ```
   O `ServiceWorker.canonical.js` é a fonte da verdade — edite ele, nunca o
   `ServiceWorker.js` direto.

2. **index_.html é a fonte editável; index.html é GERADO no build do container.**
   O Dockerfile multi-stage calcula sozinho:
   - `?v=<tamanho do data.br>` nas 4 URLs do build (versão para o cache de
     borda do Cloudflare — regra "Build Unity": path /Build/ → cache, TTL do origin);
   - `PROGRESSO_FIM_DOWNLOAD` = 0.9 * tamanho_descomprimido / (2 * tamanho_br)
     (o loader da Unity estima o descomprimido como 2x o Content-Length; a
     constante faz a barra chegar a 100% no fim real do download).
   Não editar `index.html` nem esses valores na mão.

3. Conferir que `index_.html` referencia os arquivos comprimidos:
   `gat8paciente.data.br`, `gat8paciente.framework.js.br`, `gat8paciente.wasm.br` (linhas ~247-249).

4. Commitar: build novo + `ServiceWorker.js` restaurado + `index_.html` (se mexeu).
   Depois, deploy no Coolify (porta 8091).

5. Se o build falhar no Coolify com "ERRO" do grep, é o sed que não casou —
   conferir se `index_.html` ainda tem `PROGRESSO_FIM_DOWNLOAD` e as URLs
   `/gat8paciente.*`. Falha ruidosa é intencional.

Domínio deste build: ver deploy do Coolify. Os três builds seguem o mesmo
esqueleto; só mudam nome (`gat8paciente`), porta (8091) e domínio.
