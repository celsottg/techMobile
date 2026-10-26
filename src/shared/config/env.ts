import Constants from "expo-constants";

const API_PORT = 3000;

// Em dispositivo físico/emulador, `localhost` não é a máquina de desenvolvimento.
// Sem EXPO_PUBLIC_API_URL, usa o mesmo host do servidor Metro (hostUri) na porta da API.
function resolveApiUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  return `http://${host ?? "localhost"}:${API_PORT}`;
}

export const API_URL = resolveApiUrl();
