<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1rrsJze0pF4W_iE5lsXVQ471f-whR555q

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure environment variables:
   - Add your Gemini API key to `.env.local` using the server-side variable name:
     ```.env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - If you need the API key available in client-side code (Vite), also add a `VITE_`-prefixed variable:
     ```.env
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - Warning: exposing secrets to client-side code is a security risk. Only set `VITE_GEMINI_API_KEY` if the key is intended to be public or scoped appropriately.
3. Run the app:
   `npm run dev`

## Abrir no Dev Container

Este repositório inclui uma configuração de Dev Container para desenvolvimento com Node.js 18 e Vite.

- Abra o projeto no VS Code.
- Use o comando "Reopen in Container" (ícone verde no canto inferior esquerdo) para abrir o workspace dentro do Dev Container.
- O container expõe por padrão as portas `5173` (Vite) e `3000`.

Após o primeiro build, o comando `npm install` será executado automaticamente (definido em `postCreateCommand`).

Para iniciar o servidor de desenvolvimento dentro do container execute:

```bash
npm run dev
```

## Deploy (Lovable)

Instruções gerais para publicar este app no Lovable. Se o painel do Lovable oferecer integração direta com o GitHub, o fluxo é simples:

1. No painel do Lovable, crie um novo projeto e conecte seu repositório `avilamix/vitrini-virtual` (ou autorize acesso via GitHub).
2. Configure as variáveis de ambiente no Lovable (em Settings > Environment):
   - `GEMINI_API_KEY` (server-side)
   - opcionalmente `VITE_GEMINI_API_KEY` (somente se precisar no cliente; atenção à segurança)
3. Defina o comando de build:
   - Build command: `npm ci && npm run build`
4. Defina o diretório de publicação / output:
   - Publish directory: `dist`
5. Escolha a versão do Node (se solicitado): Node 18 é compatível.
6. Inicie o deploy. O Lovable irá executar o build e publicar os arquivos estáticos.

Observações:
- Se quiser deploy automático via GitHub Actions, eu posso criar um workflow que aciona o deploy no push para `main`, mas precisarei de um token/API do Lovable com permissões de deploy.
- Se o Lovable usa um CLI (ex.: `lovable deploy`), podemos usar um Action que instala o CLI e roda o deploy.

Se preferir, me diga o link do painel Lovable (ou se o serviço tiver outro nome/URL) e eu adapto as instruções passo a passo ou crio o workflow de CI.
