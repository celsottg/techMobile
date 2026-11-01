# TechMobile

Aplicativo mobile do blog educacional do **Tech Challenge (Pós Tech FIAP)**, desenvolvido com Expo e React Native. Ele consome a mesma API REST (Fastify + PostgreSQL) usada pelo front web [TechFront](https://github.com/celsottg/techfront), com dois perfis de acesso: **professor** e **aluno**.

## Funcionalidades

| Funcionalidade | Status |
| --- | --- |
| Login com e-mail e senha (`POST /login`) | ✅ |
| Sessão salva no dispositivo e restaurada ao abrir o app | ✅ |
| Logout e encerramento automático da sessão em 401 | ✅ |
| Listagem paginada de posts (rolagem infinita e pull-to-refresh) | ✅ |
| Busca de posts por palavra-chave (com debounce) | ✅ |
| Leitura do post completo ao tocar no card (`GET /posts/:id`), com tratamento de post não encontrado | ✅ |
| Aba **Gestão** (rota `/admin`) só para professor, com hub de cadastros (`Tabs.Protected`) | ✅ |
| Visual de blog institucional: paleta azul e dourado, escala tipográfica e componentes padronizados | ✅ |
| Criação de posts (só professor, `POST /posts`) | ✅ |
| Edição de posts pelo lápis na aba Gestão, com os campos já preenchidos (só professor, `PUT /posts/:id`) | ✅ |
| Exclusão de posts pela lixeira, com confirmação (só professor, `DELETE /posts/:id`) | ✅ |
| Listagem paginada de professores na aba Gestão, com rolagem infinita e pull-to-refresh (só professor, `GET /professores`) | ✅ |
| Cadastro de novos professores na aba Gestão (só professor, `POST /professores`) | ✅ |
| Edição de professores pelo lápis, com os campos preenchidos e senha opcional (só professor, `PUT /professores/:id`) | ✅ |
| Exclusão de professores pela lixeira, com confirmação (só professor, `DELETE /professores/:id`) | ✅ |
| Listagem paginada de alunos na aba Gestão, com rolagem infinita e pull-to-refresh (só professor, `GET /alunos`) | ✅ |
| Edição de alunos pelo lápis, com os campos preenchidos e senha opcional (só professor, `PUT /alunos/:id`) | ✅ |
| Exclusão de alunos pela lixeira, com confirmação (só professor, `DELETE /alunos/:id`) | ✅ |
| Cadastro de novos alunos na aba Gestão (só professor, `POST /alunos`) | ✅ |

## Stack

| Tecnologia | Versão | Papel |
| --- | --- | --- |
| [Expo](https://docs.expo.dev/versions/v58.0.0/) | SDK 58 | Plataforma, build e ferramentas de desenvolvimento |
| [React Native](https://reactnative.dev/) | 0.88 | UI nativa (Android, iOS) e web via `react-native-web` |
| [React](https://react.dev/) | 19.3 | Biblioteca de UI, com [React Compiler](https://react.dev/learn/react-compiler) habilitado |
| [TypeScript](https://www.typescriptlang.org/) | 6.0 | Tipagem estática em modo `strict` |
| [Expo Router](https://docs.expo.dev/router/introduction/) | 58 | Navegação baseada em arquivos, abas e rotas protegidas (`Stack.Protected` e `Tabs.Protected`) |
| [expo-secure-store](https://docs.expo.dev/versions/v58.0.0/sdk/securestore/) | 58 | Armazenamento seguro da sessão (Keychain/Keystore) |
| [expo-constants](https://docs.expo.dev/versions/v58.0.0/sdk/constants/) | 58 | Descobre o host do Metro para montar a URL da API |
| [expo-symbols](https://docs.expo.dev/versions/v58.0.0/sdk/symbols/) | 58 | Ícones das abas (SF Symbols no iOS, Material Symbols no Android e web) |
| [expo-splash-screen](https://docs.expo.dev/versions/v58.0.0/sdk/splash-screen/) | 58 | Mantém o splash enquanto a sessão salva é lida |
| [react-native-safe-area-context](https://github.com/AppAndFlow/react-native-safe-area-context) | 5.10 | Respeita notch e barras do sistema |
| [ESLint](https://eslint.org/) + `eslint-config-expo` | 9 | Padronização de código |
| [Jest](https://jestjs.io/) + [`jest-expo`](https://docs.expo.dev/develop/unit-testing/) | 30 / 58 | Testes unitários e cobertura |
| [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) | 14 | Renderização de componentes e hooks nos testes |

**Decisões:**
- **Sem bibliotecas extras de HTTP, estado ou estilo:** requisições usam `fetch`, estado usa hooks do React com Context API, e estilos usam `StyleSheet` com um tema próprio (só modo claro, paleta abaixo).
- **Testes unitários com Jest:** serviços, hooks, componentes e telas têm testes ao lado do código (`*.test.ts(x)`), com a API e o `expo-router` simulados. O CI exige cobertura mínima (veja "Testes e CI").

## Arquitetura

O app segue uma **arquitetura modular dentro de `src/`**: cada domínio do backend vira um módulo independente, e a infraestrutura comum fica em `shared/`.

```
src/
├── app/                          # Rotas do Expo Router (só arquivos finos que reexportam telas)
│   ├── _layout.tsx               # ThemeProvider, SessionProvider, splash e Stack.Protected (login x área logada)
│   ├── (auth)/
│   │   └── login.tsx             # → modules/auth
│   └── (app)/                    # Área autenticada
│       ├── _layout.tsx           # Abas: Blog (todos) e Gestão (Tabs.Protected, só PROFESSOR)
│       ├── (posts)/              # Aba Blog (o grupo não aparece na URL)
│       │   ├── _layout.tsx       # Stack com header azul "Blog" (botão "Sair") e "Post"
│       │   ├── index.tsx         # Home "/" → modules/posts (lista)
│       │   └── posts/
│       │       └── [id].tsx      # "/posts/:id" → modules/posts (detalhe)
│       └── admin/                # Aba Gestão (área do professor)
│           ├── _layout.tsx       # Stack com header azul "Gestão" (botão "Sair"), "Posts", "Novo post", "Editar post", "Professores", "Novo professor", "Editar professor", "Alunos", "Novo aluno" e "Editar aluno"
│           ├── index.tsx         # "/admin" → modules/admin (hub de cadastros)
│           ├── posts/
│           │   ├── index.tsx     # "/admin/posts" → modules/admin (gestão de posts)
│           │   ├── create.tsx    # "/admin/posts/create" → modules/admin (novo post)
│           │   └── [id]/edit.tsx # "/admin/posts/:id/edit" → modules/admin (editar post)
│           ├── professores/
│           │   ├── index.tsx     # "/admin/professores" → modules/admin (lista de professores)
│           │   ├── create.tsx    # "/admin/professores/create" → modules/admin (novo professor)
│           │   └── [id]/edit.tsx # "/admin/professores/:id/edit" → modules/admin (editar professor)
│           └── alunos/
│               ├── index.tsx     # "/admin/alunos" → modules/admin (lista de alunos)
│               ├── create.tsx    # "/admin/alunos/create" → modules/admin (novo aluno)
│               └── [id]/edit.tsx # "/admin/alunos/:id/edit" → modules/admin (editar aluno)
│
├── modules/
│   ├── admin/                    # Área do professor (consome modules/posts)
│   │   ├── components/           # PostForm (título/conteúdo, criação e edição), AdminPostRow (lápis e lixeira), UsuarioForm (nome, email e senha; usado por professores e alunos), ProfessorRow e AlunoRow (avatar, nome, email, etiqueta de papel, lápis e lixeira)
│   │   ├── hooks/                # use-create-post, use-edit-post (carrega e salva), use-delete-post (confirma e exclui), use-create-professor e use-create-aluno (cadastram), use-edit-professor e use-edit-aluno (carregam e salvam), use-delete-professor e use-delete-aluno (confirmam e excluem), use-professores e use-alunos (listas paginadas)
│   │   ├── screens/              # AdminHomeScreen (hub), AdminPostsScreen, PostCreateScreen, PostEditScreen, AdminProfessoresScreen, ProfessorCreateScreen, ProfessorEditScreen, AdminAlunosScreen, AlunoCreateScreen, AlunoEditScreen
│   │   ├── services/             # professores.api.ts (GET, POST, PUT e DELETE /professores), alunos.api.ts (GET, POST, PUT e DELETE /alunos), professores-changes.ts e alunos-changes.ts (sinais de "a lista mudou")
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── auth/                     # Login (POST /login)
│   │   ├── components/           # SignOutButton (usado nos headers das abas)
│   │   ├── hooks/use-login.ts    # Estado do formulário, validação e tratamento de 400/401
│   │   ├── screens/              # LoginScreen
│   │   ├── services/auth.api.ts
│   │   ├── types.ts
│   │   └── index.ts              # API pública do módulo
│   │
│   └── posts/                    # Domínio de posts (leitura e o cliente de POST /posts)
│       ├── components/           # PostCard (clicável), SearchBar
│       ├── hooks/
│       │   ├── use-posts.ts      # Paginação, busca com debounce, refresh
│       │   └── use-post.ts       # Detalhe por id (carregando, erro, não encontrado)
│       ├── screens/              # PostListScreen, PostDetailScreen
│       ├── services/
│       │   ├── posts.api.ts      # GET /posts, /posts/search, /posts/:id, POST, PUT e DELETE
│       │   └── posts-changes.ts  # Sinal de "posts mudaram" que recarrega as listas
│       ├── utils/format-date.ts  # Datas no formato pt-BR
│       ├── types.ts
│       └── index.ts
│
└── shared/                       # Infraestrutura transversal, sem regra de negócio
    ├── api/http-client.ts        # fetch + Bearer token + ApiError (400/401/403/404)
    ├── config/env.ts             # URL da API
    ├── session/                  # SessionProvider, useSession, persistência da sessão
    ├── theme/                    # Paleta, tema do React Navigation, espaçamentos, useTheme
    └── ui/                       # Button, IconButton, TextField, Avatar, Badge, FormError, ListHeader, Loading, ErrorState, EmptyState, stackHeaderOptions
```

### Regras de dependência

```
app/  ──►  modules/*  ──►  shared/
           admin ──► posts      (só via modules/posts/index.ts)
```

- **Rotas finas:** `src/app/` só contém rotas, e cada arquivo reexporta uma tela (`export { LoginScreen as default } from "@/modules/auth"`).
- **Módulos isolados:** um módulo só importa outro pelo `index.ts` dele, `auth` e `posts` não importam um ao outro, e `posts` nunca importa `admin`.
- **`shared` independente:** `shared/` nunca importa nada de `modules/`.
- **Cliente HTTP sem React:** `shared/api` não conhece React nem a sessão. A sessão registra nele o token atual (`setAccessToken`) e o que fazer em um 401 (`setUnauthorizedHandler`).
- **Alias de imports:** `@/*` aponta para `src/*`.

### Fluxo de autenticação

```
LoginScreen ──► POST /login { email, senha }
                   ├── 400 → destaca os campos inválidos
                   ├── 401 → "E-mail ou senha inválidos." (mensagem genérica)
                   └── 200 → { token, role, usuario }
                               │
                               ▼
                 SessionProvider: salva (secure-store no nativo, localStorage na web) e repassa o token ao http-client
                               │
                               ▼
                 Stack.Protected libera (app) → Home (listagem de posts)
                 Tabs.Protected mostra a aba Gestão só se role === "PROFESSOR"
                 Requisições seguintes: Authorization: Bearer <token>
                 401 em rota autenticada → sessão encerrada → volta ao login
```

O token devolvido pelo backend é **fixo por papel** (não é JWT): todos os logins do mesmo papel recebem o mesmo token. O `role` salvo na sessão é o que controla o acesso à aba Gestão. O backend também barra escrita de ALUNO com 403.

### Navegação de leitura

```
Home "/" (PostListScreen) ── toque no card ──► "/posts/:id" (PostDetailScreen)
                                                   ├── carregando → spinner
                                                   ├── erro → mensagem + "Tentar novamente"
                                                   ├── 404 ou id inválido → "Post não encontrado" + voltar
                                                   └── 200 → título, datas e conteúdo completo (só leitura)
```

O detalhe sempre busca o post pelo id (em vez de reaproveitar o item da lista), então também funciona aberto por link direto.

### Área do professor (aba Gestão)

```
"/admin" (AdminHomeScreen, hub de cadastros)
   └── Posts ──► "/admin/posts" (AdminPostsScreen: títulos + "Novo post")
                    ├── lápis ──► "/admin/posts/:id/edit" (PostEditScreen: GET /posts/:id preenche os campos)
                    │                ── PUT /posts/:id { titulo, conteudo } → volta para a lista de gestão
                    ├── lixeira ──► confirmação ("Cancelar" / "Excluir") ── DELETE /posts/:id → lista recarrega
                    └── Novo post ──► "/admin/posts/create" (PostCreateScreen)
                                         ── POST /posts { titulo, conteudo }
                                             ├── campos vazios → erro no campo (sem chamar a API)
                                             ├── 400 → destaca os campos inválidos
                                             ├── 403 → "Você não tem permissão para esta operação."
                                             └── 201 → fecha o formulário e volta para a Home, já com o novo post
   └── Professores ──► "/admin/professores" (AdminProfessoresScreen: nome e email, com lápis e lixeira + "Novo professor")
                          │    ── GET /professores?page&limit (rolagem infinita, pull-to-refresh, estado vazio e erro com nova tentativa)
                          ├── lápis ──► "/admin/professores/:id/edit" (ProfessorEditScreen: GET /professores/:id preenche nome e email)
                          │                ── PUT /professores/:id { nome, email, senha? } → volta para a lista
                          │                    (senha em branco mantém a atual; 409 → "Este email já está em uso.")
                          ├── lixeira ──► confirmação ("Cancelar" / "Excluir") ── DELETE /professores/:id → lista recarrega
                          └── Novo professor ──► "/admin/professores/create" (ProfessorCreateScreen: nome, email e senha)
                                 ── POST /professores { nome, email, senha }
                                     ├── campos vazios, email inválido ou senha com menos de 6 caracteres → erro no campo (sem chamar a API)
                                     ├── 400 → destaca os campos inválidos
                                     ├── 409 → "Este email já está em uso." no campo de email
                                     ├── 403 → "Você não tem permissão para esta operação."
                                     └── 201 → fecha o formulário e volta para a lista, já com o novo professor
   └── Alunos ──► "/admin/alunos" (AdminAlunosScreen: nome e email, com lápis e lixeira + "Novo aluno")
                     │    ── GET /alunos?page&limit (rolagem infinita, pull-to-refresh, estado vazio e erro com nova tentativa)
                     ├── lápis ──► "/admin/alunos/:id/edit" (AlunoEditScreen: GET /alunos/:id preenche nome e email)
                     │                ── PUT /alunos/:id { nome, email, senha? } → volta para a lista
                     │                    (senha em branco mantém a atual; 409 → "Este email já está em uso.")
                     ├── lixeira ──► confirmação ("Cancelar" / "Excluir") ── DELETE /alunos/:id → lista recarrega
                     └── Novo aluno ──► "/admin/alunos/create" (AlunoCreateScreen: nome, email e senha)
                            ── POST /alunos { nome, email, senha }
                                ├── campos vazios, email inválido ou senha com menos de 6 caracteres → erro no campo (sem chamar a API)
                                ├── 400 → destaca os campos inválidos
                                ├── 409 → "Este email já está em uso." no campo de email
                                ├── 403 → "Você não tem permissão para esta operação."
                                └── 201 → fecha o formulário e volta para a lista, já com o novo aluno
```

- **Só professor:** a aba Gestão fica dentro de `Tabs.Protected`, então ALUNO não a vê nem a abre por link direto.
- **Novos cadastros:** cada cadastro novo entra como uma seção do hub, em `src/app/(app)/admin/<secao>/`.
- **Listas atualizadas:** `createPost`, `updatePost` e `deletePost` disparam `notifyPostsChanged()` (`posts-changes.ts`), e toda lista (`usePosts`) e todo detalhe (`usePost`) montados recarregam, sem refetch a cada troca de aba. `createProfessor`, `updateProfessor` e `deleteProfessor` fazem o mesmo com `notifyProfessoresChanged()` para o `useProfessores`, e `createAluno`, `updateAluno` e `deleteAluno` com `notifyAlunosChanged()` para o `useAlunos`.

## Testes e CI

Os testes ficam ao lado do código que testam (`format-date.ts` → `format-date.test.ts`). Dublês e dados de apoio ficam em `src/test/` (`fixtures.ts` e `expo-router-mock.ts`). A cobertura considera `src/modules` e `src/shared`; `src/app` (só reexporta telas), barrels `index.ts` e arquivos `types.ts` ficam de fora.

```bash
npm test                 # roda os testes
npm run test:watch       # modo watch
npm run test:coverage    # testes + cobertura (relatório HTML em coverage/lcov-report/index.html)
```

A cobertura mínima está em `coverageThreshold` no `jest.config.js` (hoje 90% de statements, linhas e funções, e 80% de branches). Se cair abaixo disso, o comando falha.

### GitHub Actions

O workflow `.github/workflows/ci.yml` roda em todo pull request para a `master` e também no push na `master` (ou seja, depois do merge). Ele tem dois jobs em paralelo:

| Job | O que faz |
| --- | --- |
| **Lint** | `npm ci` + `npm run lint` |
| **Testes e cobertura** | `npm ci` + `npm run test:coverage`, falha se algum teste quebrar ou a cobertura ficar abaixo do mínimo; mostra a tabela de cobertura no resumo da execução e publica o relatório como artefato `coverage` |

Para que o merge só seja liberado com o CI verde, ative uma regra de proteção da branch `master` em **Settings → Branches** exigindo os checks **Lint** e **Testes e cobertura**.

## Identidade visual

O visual é de **blog institucional**: azul-marinho como cor principal, dourado como destaque e fundo neutro, só em modo claro (`userInterfaceStyle: "light"`). Tudo vem de `src/shared/theme/index.ts`. As telas consomem as cores por `useTheme()` e usam os tokens de tipografia, raio e sombra, nunca valores soltos.

### Cores

| Uso | Token | Cor |
| --- | --- | --- |
| Botões, links, cabeçalhos e aba ativa | `primary` | `#1E3A5F` |
| Topo do login e botão pressionado | `primaryDark` | `#152A45` |
| Texto sobre o azul | `onPrimary` | `#FFFFFF` |
| Etiquetas, ícones e avatares | `primarySoft` | `#E6EDF5` |
| Destaque dourado (faixa dos posts, logo) | `accent` | `#C9932E` |
| Fundo / texto de etiquetas douradas | `accentSoft` / `accentDark` | `#FAF1E1` / `#8A5A12` |
| Fundo da tela | `background` | `#F5F6F8` |
| Cartões e campos | `card` | `#FFFFFF` |
| Texto principal / secundário | `text` / `textSecondary` | `#1B2430` / `#5B6675` |
| Bordas | `border` | `#DDE2E8` |
| Erros e exclusão | `danger` / `dangerSoft` | `#C2362F` / `#FBECEB` |

Os pares de texto e fundo passam no contraste WCAG AA (4,5:1).

### Tipografia, raios e sombra

- **Tipografia:** fonte do sistema (San Francisco no iOS, Roboto no Android), com a escala `Typography`:

  | Estilo | Tamanho / altura | Uso |
  | --- | --- | --- |
  | `display` | 28 / 34, negrito | Título do login e saudação da Gestão |
  | `title` | 22 / 28, negrito | Título do post |
  | `heading` | 18 / 24, seminegrito | Títulos de cards e seções |
  | `body` e `bodyStrong` | 16 / 24 | Texto de interface |
  | `reading` | 17 / 28 | Corpo do post (leitura longa) |
  | `label` | 14 / 20, seminegrito | Rótulos e botões compactos |
  | `caption` e `captionStrong` | 13 / 18 | Datas, metadados e abas |
  | `overline` | 12 / 16, caixa alta | Etiquetas ("POST", "ATUALIZADO") |

- **Raios:** `Radius` (`sm` 8, `md` 12, `lg` 16, `pill`).
- **Sombra:** `Shadow.card`, com `boxShadow` (iOS, Android e web na New Architecture).

### Componentes visuais (`src/shared/ui`)

| Componente | Uso |
| --- | --- |
| `Button` | Variantes `primary`, `secondary` e `danger`; tamanho `compact` |
| `IconButton` | Lápis e lixeira redondos das listas da Gestão |
| `Avatar` | Iniciais do nome nas listas de professores e alunos |
| `Badge` | Etiquetas "PROFESSOR", "ALUNO", "POST" e "ATUALIZADO" |
| `FormError` | Caixa de erro geral dos formulários (login, posts, professores e alunos) |
| `ListHeader` | Total de itens + botão "Novo …" no topo das listas da Gestão |
| `EmptyState` / `ErrorState` / `Loading` | Estados de lista vazia (com ícone), erro e carregamento |
| `stackHeaderOptions` | Cabeçalho azul dos Stacks das abas |

### Telas

- **Login:** topo azul com o capelo dourado, "TechMobile · Blog educacional · Pós Tech FIAP" e o formulário num cartão sobreposto.
- **Blog:** busca arredondada com lupa, cabeçalho "Publicações recentes" com o total, e cards com faixa dourada, data, etiqueta "Atualizado" e "Ler post ›". A leitura do post usa a escala `reading` com largura máxima de 720 px.
- **Gestão:** saudação "Olá, {nome}" e seções com ícone. As listas mostram o total, avatar, etiqueta de papel e botões redondos de editar e excluir. Os formulários ficam num cartão.

## Como executar

### Pré-requisitos

- Node.js 22 ou superior e npm
- Docker e Docker Compose (para a API e o banco)
- Expo Go no celular, ou um emulador Android/simulador iOS

### 1. Subir a API

O `docker-compose.yml` deste repositório sobe o PostgreSQL 14 e a imagem da API `celsottg/techchallenge:latest` na porta **3000**. O schema e os usuários de teste são criados automaticamente.

```bash
docker compose up -d
```

### 2. Instalar e rodar o app

```bash
npm install
npx expo start
```

Abra no Expo Go (QR code), em um emulador (`a` para Android, `i` para iOS) ou no navegador (`w`).

**URL da API:**
- **Padrão:** o app usa o mesmo IP da máquina onde o Metro está rodando, na porta 3000. Assim funciona em dispositivo físico e emulador sem configuração.
- **Outro endereço:** crie um `.env.local` (por exemplo, `EXPO_PUBLIC_API_URL=http://192.168.0.10:3000`).

### Usuários de teste

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Professor | `carlos.mendes@professor.fiap.br` | `senha-professor-123` |
| Aluno | `ana.beatriz@aluno.fiap.br` | `senha-aluno-456` |

## Scripts

| Comando | Descrição |
| --- | --- |
| `npx expo start` | Inicia o servidor de desenvolvimento (também `npm run android`, `ios` ou `web`) |
| `npx expo lint` | Lint com ESLint (`npm run lint`) |
| `npm test` | Testes unitários (também `npm run test:watch` e `npm run test:coverage`) |
| `npx tsc --noEmit` | Verificação de tipos |
| `npx expo install <pacote>` | Instala dependências na versão compatível com o SDK (use no lugar de `npm install <pacote>`) |
| `npx expo-doctor` | Diagnóstico de dependências e configuração |

`npm run reset-project` vem do template e está quebrado: o script foi movido para `example/scripts`, junto com o código original do template (a pasta `example/` não faz parte do build).
