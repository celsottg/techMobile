import { useState } from "react";

import { ApiError } from "@/shared/api/http-client";

import { createProfessor } from "../services/professores.api";
import type { CreateProfessorInput, Professor } from "../types";

type Field = keyof CreateProfessorInput;
type FieldErrors = Partial<Record<Field, string>>;

const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ nome, email, senha }: CreateProfessorInput): FieldErrors {
  const errors: FieldErrors = {};

  if (!nome) errors.nome = "Informe o nome.";
  if (!email) errors.email = "Informe o email.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Informe um email válido.";
  if (!senha) errors.senha = "Informe a senha.";
  else if (senha.length < MIN_PASSWORD_LENGTH) {
    errors.senha = `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  return errors;
}

/** Formulário de cadastro de professor (POST /professores, só PROFESSOR). */
export function useCreateProfessor(onCreated: (professor: Professor) => void) {
  const [values, setValues] = useState<CreateProfessorInput>({ nome: "", email: "", senha: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function changeField(field: Field, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
    setFormError(null);
  }

  async function submit() {
    if (isSubmitting) return;

    // A senha não é aparada: espaços podem fazer parte dela.
    const input = { nome: values.nome.trim(), email: values.email.trim(), senha: values.senha };
    const errors = validate(input);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const professor = await createProfessor(input);
      onCreated(professor);
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        const backendErrors = error.fieldErrors ?? {};
        setFieldErrors({
          nome: backendErrors.nome ? "Verifique o nome informado." : undefined,
          email: backendErrors.email ? "Verifique o email informado." : undefined,
          senha: backendErrors.senha ? "Verifique a senha informada." : undefined,
        });
        setFormError("Verifique os campos e tente novamente.");
      } else if (error instanceof ApiError && error.status === 409) {
        setFieldErrors({ email: "Este email já está em uso." });
      } else {
        // 403 (sem permissão) e falhas de rede usam a mensagem do cliente HTTP;
        // um 401 já encerra a sessão no próprio cliente.
        setFormError(
          error instanceof ApiError ? error.message : "Erro inesperado ao cadastrar o professor.",
        );
      }
      setIsSubmitting(false);
    }
  }

  return { ...values, fieldErrors, formError, isSubmitting, changeField, submit };
}
