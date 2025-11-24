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
