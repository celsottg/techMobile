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
| Detalhe do post | 🔜 |
| Criação, edição e exclusão de posts (só professor) | 🔜 |

## Stack

| Tecnologia | Versão | Papel |
| --- | --- | --- |
| [Expo](https://docs.expo.dev/versions/v58.0.0/) | SDK 58 | Plataforma, build e ferramentas de desenvolvimento |
| [React Native](https://reactnative.dev/) | 0.88 | UI nativa (Android, iOS) e web via `react-native-web` |
| [React](https://react.dev/) | 19.3 | Biblioteca de UI, com [React Compiler](https://react.dev/learn/react-compiler) habilitado |
| [TypeScript](https://www.typescriptlang.org/) | 6.0 | Tipagem estática em modo `strict` |
| [Expo Router](https://docs.expo.dev/router/introduction/) | 58 | Navegação baseada em arquivos e rotas protegidas (`Stack.Protected`) |
| [expo-secure-store](https://docs.expo.dev/versions/v58.0.0/sdk/securestore/) | 58 | Armazenamento seguro da sessão (Keychain/Keystore) |
| [expo-constants](https://docs.expo.dev/versions/v58.0.0/sdk/constants/) | 58 | Descobre o host do Metro para montar a URL da API |
| [expo-splash-screen](https://docs.expo.dev/versions/v58.0.0/sdk/splash-screen/) | 58 | Mantém o splash enquanto a sessão salva é lida |
| [react-native-safe-area-context](https://github.com/AppAndFlow/react-native-safe-area-context) | 5.10 | Respeita notch e barras do sistema |
| [ESLint](https://eslint.org/) + `eslint-config-expo` | 9 | Padronização de código |

**Decisões:**
- **Sem bibliotecas extras de HTTP, estado ou estilo:** requisições usam `fetch`, estado usa hooks do React com Context API, e estilos usam `StyleSheet` com um tema próprio (claro e escuro).
- **Sem testes automatizados por enquanto:** o projeto ainda não tem framework de testes configurado.

## Arquitetura

O app segue uma **arquitetura modular dentro de `src/`**: cada domínio do backend vira um módulo independente, e a infraestrutura comum fica em `shared/`.

```
src/
├── app/                          # Rotas do Expo Router (só arquivos finos que reexportam telas)
│   ├── _layout.tsx               # SessionProvider, splash e Stack.Protected (login x área logada)
│   ├── (auth)/
│   │   └── login.tsx             # → modules/auth
│   └── (app)/                    # Área autenticada
│       ├── _layout.tsx           # Header com botão "Sair"
│       └── index.tsx             # Home "/" → modules/posts
│
├── modules/
│   ├── auth/                     # Login (POST /login)
│   │   ├── hooks/use-login.ts    # Estado do formulário, validação e tratamento de 400/401
│   │   ├── screens/              # LoginScreen
│   │   ├── services/auth.api.ts
│   │   ├── types.ts
│   │   └── index.ts              # API pública do módulo
│   │
│   └── posts/                    # Leitura de posts (GET /posts, GET /posts/search)
│       ├── components/           # PostCard, SearchBar
│       ├── hooks/use-posts.ts    # Paginação, busca com debounce, refresh
│       ├── screens/              # PostListScreen
│       ├── services/posts.api.ts
│       ├── types.ts
│       └── index.ts
│
└── shared/                       # Infraestrutura transversal, sem regra de negócio
    ├── api/http-client.ts        # fetch + Bearer token + ApiError (400/401/403/404)
    ├── config/env.ts             # URL da API
    ├── session/                  # SessionProvider, useSession, persistência da sessão
    ├── theme/                    # Cores (claro/escuro), espaçamentos, useTheme
    └── ui/                       # Button, TextField, Loading, ErrorState, EmptyState
```

O módulo `admin` (gestão de posts pelo professor) está previsto e ainda não foi criado.

### Regras de dependência

```
app/  ──►  modules/*  ──►  shared/
```

- **Rotas finas:** `src/app/` só contém rotas, e cada arquivo reexporta uma tela (`export { LoginScreen as default } from "@/modules/auth"`).
- **Módulos isolados:** um módulo só importa outro pelo `index.ts` dele, e `auth` e `posts` não importam um ao outro.
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
                 SessionProvider: salva no secure-store e repassa o token ao http-client
                               │
                               ▼
                 Stack.Protected libera (app) → Home (listagem de posts)
                 Requisições seguintes: Authorization: Bearer <token>
                 401 em rota autenticada → sessão encerrada → volta ao login
```

O token devolvido pelo backend é **fixo por papel** (não é JWT): todos os logins do mesmo papel recebem o mesmo token. O `role` salvo na sessão é o que vai controlar o acesso à futura área do professor.

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
