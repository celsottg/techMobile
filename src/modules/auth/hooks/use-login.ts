import { useState } from "react";

import { ApiError } from "@/shared/api/http-client";
import { useSession } from "@/shared/session";

import { login } from "../services/auth.api";
import type { LoginRequest } from "../types";

type Field = keyof LoginRequest;
type FieldErrors = Partial<Record<Field, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, senha }: LoginRequest): FieldErrors {
  const errors: FieldErrors = {};

  if (!email) errors.email = "Informe o e-mail.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Informe um e-mail válido.";

  if (!senha) errors.senha = "Informe a senha.";

  return errors;
}

export function useLogin() {
  const { signIn } = useSession();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function changeField(field: Field, value: string) {
    if (field === "email") setEmail(value);
    else setSenha(value);

    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
    setFormError(null);
  }

  async function submit() {
    if (isSubmitting) return;

    const credentials = { email: email.trim(), senha };
    const errors = validate(credentials);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const session = await login(credentials);
      // O guard de rotas troca para a área logada assim que a sessão existe.
      signIn(session);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Mensagem genérica, como orienta o backend: não revela se o erro foi no e-mail ou na senha.
        setFormError("E-mail ou senha inválidos.");
      } else if (error instanceof ApiError && error.status === 400) {
        const backendErrors = error.fieldErrors ?? {};
        setFieldErrors({
          email: backendErrors.email ? "Verifique o e-mail informado." : undefined,
          senha: backendErrors.senha ? "Verifique a senha informada." : undefined,
        });
        setFormError("Verifique os campos e tente novamente.");
      } else {
        setFormError(error instanceof ApiError ? error.message : "Erro inesperado ao entrar.");
      }
      setIsSubmitting(false);
    }
  }

  return {
    email,
    senha,
    fieldErrors,
    formError,
    isSubmitting,
    changeField,
    submit,
  };
}
