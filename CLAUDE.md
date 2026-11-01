# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Aplicativo mobile Expo (SDK 58) / React Native 0.88 / React 19 com Expo Router, escrito em TypeScript (`strict`). É um projeto da FIAP (Tech Challenge) em estágio inicial: a área logada tem duas abas. A aba **Blog** (grupo `(posts)`) tem a Home (`/`, em `src/app/(app)/(posts)/index.tsx`) com a listagem de `src/modules/posts`, e cada card abre a leitura do post em `/posts/[id]`. A aba **Gestão** (rota `/admin`, só PROFESSOR) é o hub de cadastros do professor, do módulo `src/modules/admin`; tem as seções Posts, Professores e Alunos (listagem paginada em `/admin/alunos`, `GET /alunos`; lápis abre `/admin/alunos/[id]/edit`, `PUT`, e lixeira exclui com confirmação, `DELETE`; cadastro em `/admin/alunos/create`, `POST /alunos`); a de Professores tem a listagem paginada em `/admin/professores` (`GET /professores`; lápis abre `/admin/professores/[id]/edit`, `PUT`, e lixeira exclui com confirmação, `DELETE`) e o cadastro em `/admin/professores/create` (`POST /professores`). Na edição de professor ou aluno a senha é opcional (em branco mantém a atual). Posts tem a gestão de posts em `/admin/posts` (lápis abre `/admin/posts/[id]/edit`, lixeira exclui com confirmação) e a criação em `/admin/posts/create`. O código do template original foi movido para `example/` (não faz parte do build).

`AGENTS.md` tem regras obrigatórias para este repositório. Em especial: as APIs do Expo mudam a cada SDK, então consulte `https://docs.expo.dev/versions/v58.0.0/` (ou `https://docs.expo.dev/llms.txt`) antes de usar qualquer API de Expo/EAS/React Native, em vez de confiar na memória.

## Comandos

O projeto usa npm (`package-lock.json`), então use `npx` (não `bunx`).

```bash
npm install
npx expo start              # dev server (também: npm run android | ios | web)
npx expo lint               # lint (npm run lint)
npm test                    # testes unitários (Jest); npm run test:coverage inclui cobertura
npx tsc --noEmit            # typecheck
npx expo install <pacote>   # SEMPRE use no lugar de npm add, para resolver versões compatíveis com o SDK
npx expo-doctor             # diagnóstico de dependências/config
```

- Rode lint, testes e typecheck antes de dar uma tarefa como concluída. O `tsc` ainda acusa erros antigos em `example/` (fora do build); só os de `src/` importam.
- **Testes:** Jest com `jest-expo` e React Native Testing Library 14 (`render`, `renderHook`, `fireEvent` e `act` são assíncronos: use `await`). Config em `jest.config.js`. Escreva `*.test.ts(x)` ao lado do código, mockando a API (`@/shared/api/http-client` ou os `*.api.ts`) e o router (`jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock)`). Dados de apoio em `src/test/fixtures.ts`. Todo código novo em `src/modules` e `src/shared` deve vir com testes: o CI falha se a cobertura cair abaixo do `coverageThreshold`.
- **CI:** `.github/workflows/ci.yml` roda lint e testes com cobertura em PRs para a `master` e no push na `master`.
- Bibliotecas com código nativo exigem development build (`npx expo run:android|ios` ou `eas build --profile development`); Expo Go só inclui os módulos nativos embutidos.
- `npm run reset-project` referencia `scripts/reset-project.js`, que **não existe** mais na raiz (foi movido para `example/scripts`).

## Arquitetura

- **Roteamento:** Expo Router baseado em arquivos em `src/app/`; cada arquivo é uma tela e `_layout.tsx` define os navegadores. Código que não é rota (componentes, hooks, utils) fica fora de `src/app/`. `typedRoutes` está habilitado em `app.json`, então os tipos de rotas são gerados em `.expo/types`.
- **Alias de imports:** `@/*` → `src/*` e `@/assets/*` → `assets/*` (`tsconfig.json`).
- **Flags em `app.json`:** `reactCompiler: true` (evite `useMemo`/`useCallback` manuais por padrão) e `web.output: "server"` (renderização web com servidor, não SPA estática).
- **CNG:** não existem `ios/` nem `android/`; configure comportamento nativo via `app.json` e config plugins, nunca editando pastas nativas à mão.

### Arquitetura modular (em implementação)

A organização prevista para `src/` está em `docs/arquitetura-modular.md`. Já existem `modules/auth` (login e `SignOutButton`), `modules/posts` (listagem, detalhe e `createPost`/`updatePost`/`deletePost`), `modules/admin` (hub, criação, edição e exclusão de posts) e uma base de `shared/` (config, api, session, theme, ui e utils, com `firstName`/`initials` que ignoram títulos como "Dr." no nome). Ao criar telas ou lógica, siga essa estrutura:

- `src/modules/auth` (login via `POST /login`), `src/modules/posts` (leitura de posts, ALUNO e PROFESSOR) e `src/modules/admin` (criar, editar e remover posts, só PROFESSOR).
- `src/shared/` para infraestrutura transversal sem regra de negócio: cliente HTTP, sessão (token, role, usuario), UI genérica, tema e config.
- `src/app/` contém só rotas finas que reexportam telas dos módulos.
- Dependências: `app → modules → shared`; `admin → posts`; `shared` nunca importa `modules`. Um módulo só importa outro pelo `index.ts` dele.
- **Navegação:** `src/app/(app)/_layout.tsx` usa `Tabs` com um Stack por aba (`(posts)/_layout.tsx` e `admin/_layout.tsx`). A aba Admin fica dentro de `Tabs.Protected guard={role === "PROFESSOR"}`, o que também bloqueia deep link.
- **Área do professor:** a aba Admin é genérica. Cada novo cadastro ou edição do professor (ex.: professores e alunos) entra como uma seção nova: um item em `SECTIONS` de `admin-home-screen.tsx` e rotas em `src/app/(app)/admin/<secao>/`, registradas no Stack de `admin/_layout.tsx`.
- **Confirmações:** ações destrutivas usam `confirmDestructive` (`shared/ui/dialogs.ts`), que cai em `window.confirm` na web porque `Alert.alert` não funciona lá.
- **Invalidação de listas:** escritas em posts chamam `notifyPostsChanged()` (`modules/posts/services/posts-changes.ts`), e o `usePosts` recarrega quando a versão muda. Vale para criar, editar e remover; `usePosts` e `usePost` recarregam. Professores e alunos seguem o mesmo padrão com `notifyProfessoresChanged()`/`notifyAlunosChanged()` (`modules/admin/services/*-changes.ts`) e `useProfessores`/`useAlunos`. O formulário de nome, email e senha é compartilhado (`UsuarioForm`).

## Cores (obrigatório)

A identidade visual é de blog institucional (azul-marinho + dourado) e vive em `src/shared/theme/index.ts`. Toda tela nova ou alterada deve segui-la:

| Uso | Token | Cor |
| --- | --- | --- |
| Botões, links, cabeçalhos dos Stacks, aba ativa, post pressionado | `primary` | `#1E3A5F` |
| Topo do login e botão pressionado | `primaryDark` | `#152A45` |
| Texto e ícones sobre `primary`/`primaryDark` | `onPrimary` | `#FFFFFF` |
| Etiquetas, fundo de ícones e avatares | `primarySoft` | `#E6EDF5` |
| Destaque dourado (faixa do card de post, logo do login) | `accent` | `#C9932E` |
| Fundo de etiquetas douradas | `accentSoft` | `#FAF1E1` |
| Texto sobre `accentSoft` (o `accent` puro não tem contraste) | `accentDark` | `#8A5A12` |
| Fundo da tela | `background` | `#F5F6F8` |
| Cartões, campos de formulário e busca | `card` | `#FFFFFF` |
| Títulos e texto principal | `text` | `#1B2430` |
| Texto secundário (metadados, placeholders) | `textSecondary` | `#5B6675` |
| Bordas e divisores | `border` | `#DDE2E8` |
| Erros e exclusão | `danger` | `#C2362F` |
| Fundo de caixas de erro e do botão de excluir | `dangerSoft` | `#FBECEB` |
| Sombra dos cartões (usada por `Shadow.card`) | `shadow` | `rgba(16, 32, 56, 0.08)` |

Os pares de texto e fundo passam no contraste WCAG AA (mínimo de 4,5:1).

Regras:
- Use sempre os tokens via `useTheme()`; **nunca** escreva hex direto em componentes ou telas. Se faltar uma cor, adicione um token no tema em vez de criar um valor local.
- **Tipografia:** fonte do sistema, com a escala `Typography` (`display`, `title`, `heading`, `body`, `bodyStrong`, `reading`, `label`, `caption`, `captionStrong`, `overline`). Não escreva `fontSize`/`fontWeight`/`lineHeight` soltos: use um estilo da escala ou crie um novo nela.
- **Raios e sombra:** use `Radius` (`sm`, `md`, `lg`, `pill`) e `Shadow.card` (`boxShadow`, que funciona em iOS, Android e web na New Architecture).
- **Componentes de `shared/ui`:** prefira `Button` (variantes `primary`/`secondary`/`danger`, tamanho `compact`), `IconButton`, `Avatar`, `Badge`, `FormError`, `ListHeader`, `EmptyState` (com `icon`) e `stackHeaderOptions` (cabeçalho azul dos Stacks) a reestilizar na tela.
- Não altere os valores da tabela acima sem pedido explícito do usuário.
- O app é só modo claro (`userInterfaceStyle: "light"` em `app.json`); não reintroduza dark mode sem pedido.
- Cabeçalhos e fundo do Expo Router usam a mesma paleta via `NavigationTheme` no `ThemeProvider` de `src/app/_layout.tsx`. Os Stacks das abas usam `stackHeaderOptions` (barra azul), e a `StatusBar` é `light` no layout raiz.
- As abas aparecem como **Blog** (grupo `(posts)`) e **Gestão** (rota `admin`); os nomes de rota e as URLs não mudaram.

## Backend local

`docker-compose.yml` sobe um Postgres 14 (porta 5432) e a API `celsottg/techchallenge:latest` (porta 3000), usando credenciais e tokens de desenvolvimento (`PROFESSOR_ACCESS_TOKEN`, `ALUNO_ACCESS_TOKEN`), o que sugere dois perfis de acesso (professor e aluno). Suba com `docker compose up -d`. Em dispositivo físico ou emulador, `localhost` não aponta para a máquina de desenvolvimento. Por isso `src/shared/config/env.ts` usa `EXPO_PUBLIC_API_URL`, se definida, ou o host do Metro (`Constants.expoConfig.hostUri`) na porta 3000.

**Autenticação:**
- `POST /login` devolve `{ token, role, usuario }`. O `SessionProvider` (`src/shared/session`) guarda esse objeto: com `expo-secure-store` no nativo e `localStorage` na web.
- A sessão repassa o token ao cliente HTTP com `setAccessToken`, então `shared/api` não importa `shared/session`.
- Um 401 em rota autenticada encerra a sessão.
- `src/app/_layout.tsx` usa `Stack.Protected`: sem sessão, só `(auth)/login` fica acessível; com sessão, só `(app)`.
- O token é fixo por papel (não é JWT). O `role` da sessão decide o acesso à aba Admin. O backend também responde 403 para escrita de ALUNO.
- Usuários de teste: `carlos.mendes@professor.fiap.br` / `senha-professor-123` e `ana.beatriz@aluno.fiap.br` / `senha-aluno-456`.

## Pasta `docs/`

Os documentos em `docs/` **não fazem parte do escopo deste projeto** (não os modifique nem trate como código a ser mantido aqui). A pasta existe apenas como material de consulta: documentação do backend usado por este app e do front web já criado, para orientar o desenvolvimento do projeto mobile.

Exceção: `docs/arquitetura-modular.md` é a proposta de arquitetura **deste** projeto, escrita aqui. Ela pode ser consultada e atualizada conforme a arquitetura evoluir.
