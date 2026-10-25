# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Aplicativo mobile Expo (SDK 58) / React Native 0.88 / React 19 com Expo Router, escrito em TypeScript (`strict`). É um projeto da FIAP (Tech Challenge) em estágio inicial: a Home (`/`, em `src/app/(app)/index.tsx`) é a listagem de posts do módulo `src/modules/posts`. O código do template original foi movido para `example/` (não faz parte do build).

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

A organização prevista para `src/` está em `docs/arquitetura-modular.md`. Já existem `modules/posts` (só listagem) e uma base de `shared/` (config, api, session, theme, ui); `auth` e `admin` ainda não. Ao criar telas ou lógica, siga essa estrutura:

- `src/modules/auth` (login via `POST /login`), `src/modules/posts` (leitura de posts, ALUNO e PROFESSOR) e `src/modules/admin` (criar, editar e remover posts, só PROFESSOR).
- `src/shared/` para infraestrutura transversal sem regra de negócio: cliente HTTP, sessão (token, role, usuario), UI genérica, tema e config.
- `src/app/` contém só rotas finas que reexportam telas dos módulos.
- Dependências: `app → modules → shared`; `admin → posts`; `shared` nunca importa `modules`. Um módulo só importa outro pelo `index.ts` dele.

## Backend local

`docker-compose.yml` sobe um Postgres 14 (porta 5432) e a API `celsottg/techchallenge:latest` (porta 3000), usando credenciais e tokens de desenvolvimento (`PROFESSOR_ACCESS_TOKEN`, `ALUNO_ACCESS_TOKEN`), o que sugere dois perfis de acesso (professor e aluno). Suba com `docker compose up -d`. Em dispositivo físico ou emulador, `localhost` não aponta para a máquina de desenvolvimento. Por isso `src/shared/config/env.ts` usa `EXPO_PUBLIC_API_URL`, se definida, ou o host do Metro (`Constants.expoConfig.hostUri`) na porta 3000.

Ainda não há login: `src/shared/session` devolve um token de dev fixo (`EXPO_PUBLIC_DEV_ACCESS_TOKEN`, padrão `aluno-dev-token-change-me`). Quando o módulo `auth` existir, `getAccessToken()` passa a devolver o token de `POST /login`.

## Pasta `docs/`

Os documentos em `docs/` **não fazem parte do escopo deste projeto** (não os modifique nem trate como código a ser mantido aqui). A pasta existe apenas como material de consulta: documentação do backend usado por este app e do front web já criado, para orientar o desenvolvimento do projeto mobile.

Exceção: `docs/arquitetura-modular.md` é a proposta de arquitetura **deste** projeto, escrita aqui. Ela pode ser consultada e atualizada conforme a arquitetura evoluir.
