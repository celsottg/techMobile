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
| Aba **Admin** só para professor, com hub de cadastros (`Tabs.Protected`) | ✅ |
| Criação de posts (só professor, `POST /posts`) | ✅ |
| Edição de posts pelo lápis na aba Admin, com os campos já preenchidos (só professor, `PUT /posts/:id`) | ✅ |
| Exclusão de posts pela lixeira, com confirmação (só professor, `DELETE /posts/:id`) | ✅ |

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

**Decisões:**
- **Sem bibliotecas extras de HTTP, estado ou estilo:** requisições usam `fetch`, estado usa hooks do React com Context API, e estilos usam `StyleSheet` com um tema próprio (só modo claro, paleta abaixo).
- **Sem testes automatizados por enquanto:** o projeto ainda não tem framework de testes configurado.

## Arquitetura

O app segue uma **arquitetura modular dentro de `src/`**: cada domínio do backend vira um módulo independente, e a infraestrutura comum fica em `shared/`.

```
src/
├── app/                          # Rotas do Expo Router (só arquivos finos que reexportam telas)
│   ├── _layout.tsx               # ThemeProvider, SessionProvider, splash e Stack.Protected (login x área logada)
│   ├── (auth)/
│   │   └── login.tsx             # → modules/auth
│   └── (app)/                    # Área autenticada
│       ├── _layout.tsx           # Abas: Posts (todos) e Admin (Tabs.Protected, só PROFESSOR)
│       ├── (posts)/              # Aba Posts (o grupo não aparece na URL)
│       │   ├── _layout.tsx       # Stack com header "Posts" (botão "Sair") e "Post"
│       │   ├── index.tsx         # Home "/" → modules/posts (lista)
│       │   └── posts/
│       │       └── [id].tsx      # "/posts/:id" → modules/posts (detalhe)
│       └── admin/                # Aba Admin (área do professor)
│           ├── _layout.tsx       # Stack com header "Admin" (botão "Sair"), "Posts", "Novo post" e "Editar post"
│           ├── index.tsx         # "/admin" → modules/admin (hub de cadastros)
│           └── posts/
│               ├── index.tsx     # "/admin/posts" → modules/admin (gestão de posts)
│               ├── create.tsx    # "/admin/posts/create" → modules/admin (novo post)
│               └── [id]/edit.tsx # "/admin/posts/:id/edit" → modules/admin (editar post)
│
├── modules/
│   ├── admin/                    # Área do professor (consome modules/posts)
│   │   ├── components/           # PostForm (título/conteúdo, criação e edição), AdminPostRow (lápis e lixeira)
│   │   ├── hooks/                # use-create-post, use-edit-post (carrega e salva), use-delete-post (confirma e exclui)
│   │   ├── screens/              # AdminHomeScreen (hub), AdminPostsScreen, PostCreateScreen, PostEditScreen
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
    └── ui/                       # Button, TextField, Loading, ErrorState, EmptyState
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
                 Tabs.Protected mostra a aba Admin só se role === "PROFESSOR"
                 Requisições seguintes: Authorization: Bearer <token>
                 401 em rota autenticada → sessão encerrada → volta ao login
```

O token devolvido pelo backend é **fixo por papel** (não é JWT): todos os logins do mesmo papel recebem o mesmo token. O `role` salvo na sessão é o que controla o acesso à aba Admin. O backend também barra escrita de ALUNO com 403.

### Navegação de leitura

```
Home "/" (PostListScreen) ── toque no card ──► "/posts/:id" (PostDetailScreen)
                                                   ├── carregando → spinner
                                                   ├── erro → mensagem + "Tentar novamente"
                                                   ├── 404 ou id inválido → "Post não encontrado" + voltar
                                                   └── 200 → título, datas e conteúdo completo (só leitura)
```

O detalhe sempre busca o post pelo id (em vez de reaproveitar o item da lista), então também funciona aberto por link direto.

### Área do professor (aba Admin)

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
```

- **Só professor:** a aba Admin fica dentro de `Tabs.Protected`, então ALUNO não a vê nem a abre por link direto.
- **Novos cadastros:** cada cadastro novo (ex.: professores e alunos) entra como uma seção do hub, em `src/app/(app)/admin/<secao>/`.
- **Listas atualizadas:** `createPost`, `updatePost` e `deletePost` disparam `notifyPostsChanged()` (`posts-changes.ts`), e toda lista (`usePosts`) e todo detalhe (`usePost`) montados recarregam, sem refetch a cada troca de aba.

## Identidade visual

O app usa uma paleta fixa, só em modo claro (`userInterfaceStyle: "light"`). As cores ficam em `src/shared/theme/index.ts` e as telas as consomem por `useTheme()`, nunca com hex direto. O cabeçalho e o fundo da navegação usam a mesma paleta via `ThemeProvider`.

| Uso | Token | Cor |
| --- | --- | --- |
| Fundo da tela | `background` | `#F4F7F5` |
| Cartões e campo de busca | `card` | `#FFFFFF` |
| Títulos e texto principal | `text` | `#24332F` |
| Texto secundário | `textSecondary` | `#687671` |
| Bordas | `border` | `#E1E9E4` |
| Botões, links e destaques | `primary` | `#34786B` |
| Destaque discreto, como etiquetas | `primarySoft` | `#E8F2EE` |

Tokens de apoio: `onPrimary` (`#FFFFFF`, texto sobre botões) e `danger` (`#DC2626`, erros).

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
| `npx tsc --noEmit` | Verificação de tipos |
| `npx expo install <pacote>` | Instala dependências na versão compatível com o SDK (use no lugar de `npm install <pacote>`) |
| `npx expo-doctor` | Diagnóstico de dependências e configuração |

`npm run reset-project` vem do template e está quebrado: o script foi movido para `example/scripts`, junto com o código original do template (a pasta `example/` não faz parte do build).
