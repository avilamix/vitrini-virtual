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

### Como conectar o GitHub (passo-a-passo)

1. Entre no painel do Lovable e vá para **Integrations → GitHub** (ou similar).
2. Clique em **Connect repository** (ou **Authorize GitHub**). Conceda as permissões necessárias (repo:read, workflow access se solicitado).
3. Selecione o repositório `avilamix/vitrini-virtual` e habilite deploys automáticos para a branch `main`.
4. No painel do Lovable, configure as variáveis de ambiente relativas ao projeto (Settings → Environment):
    - `GEMINI_API_KEY` (server-side)
    - `VITE_GEMINI_API_KEY` (opcional, somente se necessário no cliente)
5. Opcional: se preferir deploy via token/API em vez da integração GitHub, crie um token no Lovable (API keys) e adicione o secret `LOVABLE_TOKEN` no GitHub (Repository → Settings → Secrets → Actions).
    - Se for necessário especificar o projeto ao chamar a API/CLI, adicione também `LOVABLE_PROJECT_ID` como secret.

### Habilitar o deploy automático via GitHub Actions

O repositório já contém um workflow (`.github/workflows/deploy-lovable.yml`) que:
- faz build (`npm ci && npm run build`) quando há push em `main`;
- armazena `dist` como artifact;
- tenta executar o script token-based `.github/scripts/deploy-to-lovable.sh` se o secret `LOVABLE_TOKEN` estiver definido;
- se `LOVABLE_TOKEN` não estiver definido, o workflow não falha — o deploy poderá ser tratado pela integração GitHub do Lovable.

Para usar deploy token-based (ex.: CLI/API):
1. Adicione os secrets no GitHub:
    - `LOVABLE_TOKEN`: token de deploy da Lovable
    - `LOVABLE_PROJECT_ID` (opcional): ID do projeto no Lovable
2. Edite `.github/scripts/deploy-to-lovable.sh` para ajustar a URL/API ou comando CLI conforme a documentação do Lovable (o script já tenta usar `lovable deploy` se a CLI estiver instalada no runner).

Se quiser, eu posso preencher o script automaticamente se você me fornecer o comando exato do Lovable (CLI) ou o endpoint da API.

Se preferir, me diga o link do painel Lovable (ou se o serviço tiver outro nome/URL) e eu adapto as instruções passo a passo ou crio o workflow de CI.
