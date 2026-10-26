import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { Session } from "./types";

const SESSION_KEY = "techmobile.session";

// expo-secure-store não funciona na web; lá a sessão fica no localStorage.
export async function readSession(): Promise<Session | null> {
  const raw =
    Platform.OS === "web"
      ? typeof window !== "undefined"
        ? window.localStorage.getItem(SESSION_KEY)
        : null
      : await SecureStore.getItemAsync(SESSION_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function writeSession(session: Session | null) {
  if (Platform.OS === "web") {
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  if (session) await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  else await SecureStore.deleteItemAsync(SESSION_KEY);
}
