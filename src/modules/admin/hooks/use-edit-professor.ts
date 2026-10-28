import { useEffect, useState } from "react";

import { ApiError } from "@/shared/api/http-client";

import { fetchProfessor, updateProfessor } from "../services/professores.api";
import type { CreateProfessorInput, Professor } from "../types";

type Field = keyof CreateProfessorInput;
type FieldErrors = Partial<Record<Field, string>>;
type Status = "loading" | "success" | "error" | "not-found";

type Result =
  | { status: "success"; professor: Professor }
  | { status: "error"; error: string }
  | { status: "not-found" };

const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ nome, email, senha }: CreateProfessorInput): FieldErrors {
  const errors: FieldErrors = {};

  if (!nome) errors.nome = "Informe o nome.";
  if (!email) errors.email = "Informe o email.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Informe um email válido.";
  // A senha é opcional na edição, mas se vier precisa ser válida.
  if (senha && senha.length < MIN_PASSWORD_LENGTH) {
    errors.senha = `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  return errors;
}

/**
 * Edição de professor (GET /professores/:id para preencher e PUT /professores/:id para salvar,
 * só PROFESSOR). `id` vem da URL, então pode não ser numérico.
 */
export function useEditProfessor(id: string | undefined, onUpdated: (professor: Professor) => void) {
  const professorId = Number(id);
  const isValidId = Number.isInteger(professorId) && professorId > 0;

  const [reloadKey, setReloadKey] = useState(0);
  // Guarda a qual requisição (id + tentativa) o resultado pertence; enquanto não bater
  // com a atual, a tela está carregando.
  const [result, setResult] = useState<(Result & { key: string }) | null>(null);
  const requestKey = `${professorId}:${reloadKey}`;

  // O que o usuário digitou; enquanto for null, o campo mostra o valor atual do professor.
  const [nomeEdit, setNomeEdit] = useState<string | null>(null);
  const [emailEdit, setEmailEdit] = useState<string | null>(null);
  const [senha, setSenha] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isValidId) return;

    // Descarta a resposta se o id mudar ou a tela desmontar antes dela chegar.
    let cancelled = false;

    async function load() {
      let next: Result;
      try {
        next = { status: "success", professor: await fetchProfessor(professorId) };
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          next = { status: "not-found" };
        } else {
          next = {
            status: "error",
            error: e instanceof ApiError ? e.message : "Erro inesperado ao carregar o professor.",
          };
        }
      }
      if (!cancelled) setResult({ ...next, key: requestKey });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [professorId, isValidId, requestKey]);

  const current = result?.key === requestKey ? result : null;
  const status: Status = !isValidId ? "not-found" : (current?.status ?? "loading");
  const professor = current?.status === "success" ? current.professor : null;

  const nome = nomeEdit ?? professor?.nome ?? "";
  const email = emailEdit ?? professor?.email ?? "";

  function retry() {
    setReloadKey((key) => key + 1);
  }

  function changeField(field: Field, value: string) {
    if (field === "nome") setNomeEdit(value);
    else if (field === "email") setEmailEdit(value);
    else setSenha(value);

    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
    setFormError(null);
  }

  async function submit() {
    if (isSubmitting || !professor) return;

    // A senha não é aparada: espaços podem fazer parte dela.
    const input = { nome: nome.trim(), email: email.trim(), senha };
    const errors = validate(input);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const updated = await updateProfessor(professor.id, {
        nome: input.nome,
        email: input.email,
        // Sem senha, o backend mantém a atual.
        ...(input.senha ? { senha: input.senha } : {}),
      });
      onUpdated(updated);
    } catch (e) {
      if (e instanceof ApiError && e.status === 400) {
        const backendErrors = e.fieldErrors ?? {};
        setFieldErrors({
          nome: backendErrors.nome ? "Verifique o nome informado." : undefined,
          email: backendErrors.email ? "Verifique o email informado." : undefined,
          senha: backendErrors.senha ? "Verifique a senha informada." : undefined,
        });
        setFormError("Verifique os campos e tente novamente.");
      } else if (e instanceof ApiError && e.status === 409) {
        setFieldErrors({ email: "Este email já está em uso." });
      } else if (e instanceof ApiError && e.status === 404) {
        setFormError("Este professor não existe mais.");
      } else {
        setFormError(e instanceof ApiError ? e.message : "Erro inesperado ao salvar o professor.");
      }
      setIsSubmitting(false);
    }
  }

  return {
    status,
    error: current?.status === "error" ? current.error : null,
    retry,
    nome,
    email,
    senha,
    fieldErrors,
    formError,
    isSubmitting,
    changeField,
    submit,
  };
}
