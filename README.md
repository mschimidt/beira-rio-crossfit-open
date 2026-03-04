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

## Como o Sistema Funciona

A aplicação foi estruturada para ser modular e escalável, seguindo as melhores práticas do ecossistema React.

### Estrutura de Pastas

-   **/src/components:** Contém componentes React reutilizáveis, como formulários, botões e tabelas.
-   **/src/pages:** Contém os componentes de nível superior que representam as páginas da aplicação (HomePage, LoginPage, AdminPage).
-   **/src/firebase:** Centraliza a configuração e os serviços do Firebase, como a comunicação com o Firestore (`athleteService.js`).
-   **/src/contexts:** Armazena contextos React, como o `AuthContext`, para gerenciamento de estado global (ex: autenticação do usuário).
-   **/src/locales:** Contém os arquivos de tradução (JSON) para o suporte a múltiplos idiomas.
-   **/src/assets:** Armazena imagens e outros recursos estáticos.

### Componentes Principais

-   **App.jsx:** É o componente raiz que define a estrutura principal da página, incluindo o cabeçalho, o rodapé e o roteamento.
-   **HomePage.jsx:** A página inicial que exibe o leaderboard público e os filtros de categoria.
-   **AdminPage.jsx:** Uma página protegida onde os administradores podem adicionar novos atletas e (futuramente) registrar suas pontuações.
-   **ProtectedRoute.jsx:** Um componente de ordem superior que verifica se o usuário está autenticado antes de renderizar uma página protegida.

### Gerenciamento de Estado

O estado da aplicação é gerenciado principalmente através dos Hooks do React:
-   `useState`: Para gerenciar o estado local dos componentes (ex: dados de formulários, atletas filtrados).
-   `useEffect`: Para lidar com efeitos colaterais, como o carregamento inicial de dados do Firebase.
-   `useContext`: Para acessar o estado de autenticação global fornecido pelo `AuthContext`.

### Roteamento

A navegação é implementada com `react-router-dom`. O arquivo `App.jsx` define as rotas da aplicação, incluindo a rota `/admin` que é protegida pelo `ProtectedRoute`.

### Integração com Firebase

A comunicação com o backend é feita através do Firebase:
-   **Firebase Authentication:** Usado para proteger a área administrativa, permitindo o login apenas de usuários autorizados.
-   **Firestore:** Utilizado como banco de dados NoSQL para armazenar a lista de atletas e suas informações. O serviço `athleteService.js` abstrai as chamadas ao Firestore.

### Internacionalização (i18n)

O suporte a múltiplos idiomas é fornecido pela biblioteca `i18next`. Os textos da interface são armazenados em arquivos JSON na pasta `/src/locales`. O componente `LanguageSwitcher` permite que o usuário alterne entre os idiomas disponíveis.

## Fluxo de Utilização

Existem dois fluxos principais de interação com a aplicação, um para o público geral e outro para administradores.

### 1. Usuário Visitante (Público)

-   **Acesso à Página Inicial:** Ao acessar a URL da aplicação, o usuário visualiza o leaderboard completo com todos os atletas.
-   **Filtro por Categoria:** O usuário pode clicar nos botões de categoria (ex: "Masculino RX", "Feminino Scale") para filtrar o ranking e ver apenas os atletas daquela categoria.
-   **Mudança de Idioma:** No canto superior direito, o usuário pode alternar entre Português (PT) e Inglês (EN), e toda a interface será traduzida.

### 2. Administrador

-   **Acesso à Área de Login:** Na página inicial, o administrador clica no ícone de engrenagem (canto inferior direito) para ser redirecionado à página de login.
-   **Autenticação:** O administrador insere seu e-mail e senha. As credenciais são validadas pelo Firebase Authentication.
-   **Acesso à Página de Administração:** Após o login bem-sucedido, ele é redirecionado para a página `/admin`.
-   **Gerenciamento de Atletas:** Na página de administração, o administrador pode:
    -   Adicionar um novo atleta, preenchendo nome, box e categoria.
    -   Visualizar a lista de atletas já cadastrados.
-   **Inserção de Score:**
    -   Seleciona o atleta
    -   Informa o Score
    -   Informa o Time
-   **Logout:** Ao final da sessão, o administrador clica no botão "Logout" para sair da área protegida e retornar à página inicial.

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
    "homepage": "https://mschimidt.github.io/beira-rio-crossfit-open",
    ```

3.  **Execute o script de deploy:** Rode o comando abaixo para fazer o build da aplicação e enviá-la para a branch `gh-pages` do seu repositório.

    ```bash
    npm run deploy
    ```

4.  **Habilite o GitHub Pages:** No seu repositório no GitHub, vá em **Settings > Pages**. Na seção "Build and deployment", configure a fonte (Source) para **"Deploy from a branch"** e selecione a branch `gh-pages` com a pasta `/ (root)`. Salve as alterações.

Após alguns instantes, sua aplicação estará disponível na URL que você configurou no campo `homepage`.
