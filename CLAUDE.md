# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Aplicativo mobile Expo (SDK 58) / React Native 0.88 / React 19 com Expo Router, escrito em TypeScript (`strict`). É um projeto da FIAP (Tech Challenge) em estágio inicial: a área logada tem duas abas. A aba **Posts** tem a Home (`/`, em `src/app/(app)/(posts)/index.tsx`) com a listagem de `src/modules/posts`, e cada card abre a leitura do post em `/posts/[id]`. A aba **Admin** (`/admin`, só PROFESSOR) é o hub de cadastros do professor, do módulo `src/modules/admin`; por enquanto tem só a seção Posts, com a gestão de posts em `/admin/posts` (lápis abre `/admin/posts/[id]/edit`, lixeira exclui com confirmação) e a criação em `/admin/posts/create`. O código do template original foi movido para `example/` (não faz parte do build).

`AGENTS.md` tem regras obrigatórias para este repositório. Em especial: as APIs do Expo mudam a cada SDK, então consulte `https://docs.expo.dev/versions/v58.0.0/` (ou `https://docs.expo.dev/llms.txt`) antes de usar qualquer API de Expo/EAS/React Native, em vez de confiar na memória.

## Comandos

O projeto usa npm (`package-lock.json`), então use `npx` (não `bunx`).

```bash
npm install
npx expo start              # dev server (também: npm run android | ios | web)
npx expo lint               # lint (npm run lint)
npx tsc --noEmit            # typecheck
npx expo install <pacote>   # SEMPRE use no lugar de npm add, para resolver versões compatíveis com o SDK
npx expo-doctor             # diagnóstico de dependências/config
```

- Não há framework de testes configurado (nenhum Jest nem script `test`).
- Rode lint e typecheck antes de dar uma tarefa como concluída.
- Bibliotecas com código nativo exigem development build (`npx expo run:android|ios` ou `eas build --profile development`); Expo Go só inclui os módulos nativos embutidos.
- `npm run reset-project` referencia `scripts/reset-project.js`, que **não existe** mais na raiz (foi movido para `example/scripts`).

## Arquitetura

- **Roteamento:** Expo Router baseado em arquivos em `src/app/`; cada arquivo é uma tela e `_layout.tsx` define os navegadores. Código que não é rota (componentes, hooks, utils) fica fora de `src/app/`. `typedRoutes` está habilitado em `app.json`, então os tipos de rotas são gerados em `.expo/types`.
- **Alias de imports:** `@/*` → `src/*` e `@/assets/*` → `assets/*` (`tsconfig.json`).
- **Flags em `app.json`:** `reactCompiler: true` (evite `useMemo`/`useCallback` manuais por padrão) e `web.output: "server"` (renderização web com servidor, não SPA estática).
- **CNG:** não existem `ios/` nem `android/`; configure comportamento nativo via `app.json` e config plugins, nunca editando pastas nativas à mão.

### Arquitetura modular (em implementação)

A organização prevista para `src/` está em `docs/arquitetura-modular.md`. Já existem `modules/auth` (login e `SignOutButton`), `modules/posts` (listagem, detalhe e `createPost`/`updatePost`/`deletePost`), `modules/admin` (hub, criação, edição e exclusão de posts) e uma base de `shared/` (config, api, session, theme, ui). Ao criar telas ou lógica, siga essa estrutura:

- `src/modules/auth` (login via `POST /login`), `src/modules/posts` (leitura de posts, ALUNO e PROFESSOR) e `src/modules/admin` (criar, editar e remover posts, só PROFESSOR).
- `src/shared/` para infraestrutura transversal sem regra de negócio: cliente HTTP, sessão (token, role, usuario), UI genérica, tema e config.
- `src/app/` contém só rotas finas que reexportam telas dos módulos.
- Dependências: `app → modules → shared`; `admin → posts`; `shared` nunca importa `modules`. Um módulo só importa outro pelo `index.ts` dele.
- **Navegação:** `src/app/(app)/_layout.tsx` usa `Tabs` com um Stack por aba (`(posts)/_layout.tsx` e `admin/_layout.tsx`). A aba Admin fica dentro de `Tabs.Protected guard={role === "PROFESSOR"}`, o que também bloqueia deep link.
- **Área do professor:** a aba Admin é genérica. Cada novo cadastro ou edição do professor (ex.: professores e alunos) entra como uma seção nova: um item em `SECTIONS` de `admin-home-screen.tsx` e rotas em `src/app/(app)/admin/<secao>/`, registradas no Stack de `admin/_layout.tsx`.
- **Confirmações:** ações destrutivas usam `confirmDestructive` (`shared/ui/dialogs.ts`), que cai em `window.confirm` na web porque `Alert.alert` não funciona lá.
- **Invalidação de listas:** escritas em posts chamam `notifyPostsChanged()` (`modules/posts/services/posts-changes.ts`), e o `usePosts` recarrega quando a versão muda. Vale para criar, editar e remover; `usePosts` e `usePost` recarregam.

## Cores (obrigatório)

A paleta do app é fixa e vive em `src/shared/theme/index.ts`. Toda tela nova ou alterada deve segui-la:

| Uso | Token | Cor |
| --- | --- | --- |
| Fundo da tela | `background` | `#F4F7F5` |
| Cartões e campo de busca (também campos de formulário e cabeçalhos) | `card` | `#FFFFFF` |
| Títulos e texto principal | `text` | `#24332F` |
| Texto secundário (metadados, placeholders) | `textSecondary` | `#687671` |
| Bordas | `border` | `#E1E9E4` |
| Botões, links e destaques (ex.: post selecionado/pressionado) | `primary` | `#34786B` |
| Destaque discreto, como etiquetas | `primarySoft` | `#E8F2EE` |

Regras:
- Use sempre os tokens via `useTheme()`; **nunca** escreva hex direto em componentes ou telas. Se faltar uma cor, adicione um token no tema (como já existem `onPrimary` e `danger`) em vez de criar um valor local.
- Não altere os valores da tabela acima sem pedido explícito do usuário.
- O app é só modo claro (`userInterfaceStyle: "light"` em `app.json`); não reintroduza dark mode sem pedido.
- Cabeçalhos e fundo do Expo Router usam a mesma paleta via `NavigationTheme` no `ThemeProvider` de `src/app/_layout.tsx`.

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
