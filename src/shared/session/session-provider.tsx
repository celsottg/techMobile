import { createContext, use, useEffect, useState, type PropsWithChildren } from "react";

import { setAccessToken, setUnauthorizedHandler } from "@/shared/api/http-client";

import { readSession, writeSession } from "./storage";
import type { Session } from "./types";

type SessionContextValue = {
  session: Session | null;
  // true enquanto a sessão salva no dispositivo ainda está sendo lida.
  isLoading: boolean;
  signIn: (session: Session) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const context = use(SessionContext);
  if (!context) {
    throw new Error("useSession deve ser usado dentro de <SessionProvider>");
  }
  return context;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function updateSession(next: Session | null) {
    setAccessToken(next?.token ?? null);
    setSession(next);
    writeSession(next).catch((error) => console.error("Falha ao salvar a sessão:", error));
  }

  useEffect(() => {
    let active = true;

    readSession()
      .then((stored) => {
        if (!active) return;
        setAccessToken(stored?.token ?? null);
        setSession(stored);
      })
      .catch((error) => console.error("Falha ao ler a sessão:", error))
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Token recusado pelo backend (401) encerra a sessão e o guard de rotas leva ao login.
  useEffect(() => {
    setUnauthorizedHandler(() => updateSession(null));
    return () => setUnauthorizedHandler(null);
  });

  const value: SessionContextValue = {
    session,
    isLoading,
    signIn: updateSession,
    signOut: () => updateSession(null),
  };

  return <SessionContext value={value}>{children}</SessionContext>;
}
