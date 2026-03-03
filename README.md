# Portal de Leaderboard de CrossFit - Beira Rio

Este projeto é uma Single Page Application (SPA) desenvolvida em React.js para exibir os placares e rankings das provas do "Open" de CrossFit. A aplicação foi criada para ser responsiva (mobile-first) e pode ser hospedada gratuitamente no GitHub Pages.

## Stack de Tecnologias

- **Front-end:** React.js com Vite
- **Estilização:** Tailwind CSS
- **Back-end & Banco de Dados:** Firebase (Firestore e Auth)
- **Internacionalização:** i18next

## Funcionalidades

- **Leaderboard Público:** Exibe o ranking de atletas com filtros por categoria.
- **Área de Administração Protegida:** Permite o gerenciamento de atletas e (futuramente) o lançamento de pontuações.
- **Suporte a Múltiplos Idiomas:** Interface em Português (BR) e Inglês.

---

## Guia de Instalação e Deploy

Siga os passos abaixo para configurar e rodar o projeto localmente, e também para fazer o deploy no GitHub Pages.

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)
- Uma conta no [Firebase](https://firebase.google.com/)

### 2. Clonando o Repositório

Primeiro, clone este repositório para a sua máquina local.

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd beira-rio-crossfit-open
```

### 3. Instalação das Dependências

Instale todas as dependências do projeto usando npm.

```bash
npm install
```

### 4. Configuração do Firebase e Variáveis de Ambiente

Para manter suas chaves de API seguras, o projeto foi configurado para lê-las a partir de **variáveis de ambiente**. Você precisará configurá-las para o desenvolvimento local e para o deploy no GitHub.

1.  **Crie um projeto no Firebase:** Acesse o [console do Firebase](https://console.firebase.google.com/) e crie um novo projeto. Ative os serviços de **Authentication** (com o provedor E-mail/senha) e **Firestore**.
2.  **Obtenha as credenciais:** Nas configurações do seu projeto no Firebase, encontre e copie as chaves do seu aplicativo web (apiKey, authDomain, etc.).

#### Para Desenvolvimento Local:

1.  **Crie o arquivo `.env`:** Na raiz do projeto, crie uma cópia do arquivo `.env.example` e renomeie-a para `.env`.
2.  **Preencha as variáveis:** Abra o arquivo `.env` e cole as credenciais do Firebase que você copiou.

    ```
    # .env
    VITE_API_KEY="SUA_API_KEY"
    VITE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
    VITE_PROJECT_ID="SEU_PROJECT_ID"
    # ...e assim por diante para todas as chaves.
    ```

    O Vite carregará automaticamente essas variáveis ao rodar `npm run dev`.

#### Para Deploy no GitHub Pages:

O GitHub Actions usará as **Secrets do Repositório** para popular as variáveis de ambiente durante o build.

1.  **Navegue até as configurações do seu repositório no GitHub.**
2.  Vá para **Settings > Secrets and variables > Actions**.
3.  Clique em **New repository secret** para cada uma das variáveis do Firebase.
4.  **IMPORTANTE:** O nome da secret no GitHub deve ser o mesmo nome da variável no arquivo `.env`, incluindo o prefixo `VITE_`.
    -   `VITE_API_KEY`
    -   `VITE_AUTH_DOMAIN`
    -   `VITE_PROJECT_ID`
    -   `VITE_STORAGE_BUCKET`
    -   `VITE_MESSAGING_SENDER_ID`
    -   `VITE_APP_ID`

    Ao executar o script `npm run deploy`, o processo de build do Vite substituirá automaticamente as referências no código por essas secrets.

### 5. Rodando o Projeto Localmente

Com tudo configurado, você pode iniciar o servidor de desenvolvimento.

```bash
npm run dev
```

Acesse `http://localhost:5173` (ou o endereço indicado no seu terminal) para ver a aplicação em funcionamento.

### 6. Deploy no GitHub Pages

O projeto está configurado para um deploy simplificado usando o pacote `gh-pages`.

1.  **Crie um repositório no GitHub:** Crie um novo repositório no GitHub e envie o código do seu projeto para ele.

    ```bash
    git remote add origin https://github.com/<SEU_USUARIO_GITHUB>/<NOME_DO_REPOSITORIO>.git
    git branch -M main
    git push -u origin main
    ```

2.  **Configure o `package.json`:** Abra o arquivo `package.json` e atualize o campo `homepage` com a URL do seu GitHub Pages.

    ```json
    "homepage": "https://<SEU_USUARIO_GITHUB>.github.io/<NOME_DO_REPOSITORIO>",
    ```

3.  **Execute o script de deploy:** Rode o comando abaixo para fazer o build da aplicação e enviá-la para a branch `gh-pages` do seu repositório.

    ```bash
    npm run deploy
    ```

4.  **Habilite o GitHub Pages:** No seu repositório no GitHub, vá em **Settings > Pages**. Na seção "Build and deployment", configure a fonte (Source) para **"Deploy from a branch"** e selecione a branch `gh-pages` com a pasta `/ (root)`. Salve as alterações.

Após alguns instantes, sua aplicação estará disponível na URL que você configurou no campo `homepage`.
