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
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
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
