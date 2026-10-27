import { useState } from "react";

import { createPost, type CreatePostInput, type Post } from "@/modules/posts";
import { ApiError } from "@/shared/api/http-client";

type Field = keyof CreatePostInput;
type FieldErrors = Partial<Record<Field, string>>;

function validate({ titulo, conteudo }: CreatePostInput): FieldErrors {
  const errors: FieldErrors = {};

  if (!titulo) errors.titulo = "Informe o título.";
  if (!conteudo) errors.conteudo = "Informe o conteúdo.";

  return errors;
}

/** Formulário de criação de post (POST /posts, só PROFESSOR). */
export function useCreatePost(onCreated: (post: Post) => void) {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function changeField(field: Field, value: string) {
    if (field === "titulo") setTitulo(value);
    else setConteudo(value);

    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
    setFormError(null);
  }

  async function submit() {
    if (isSubmitting) return;

    const input = { titulo: titulo.trim(), conteudo: conteudo.trim() };
    const errors = validate(input);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const post = await createPost(input);
      onCreated(post);
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        const backendErrors = error.fieldErrors ?? {};
        setFieldErrors({
          titulo: backendErrors.titulo ? "Verifique o título informado." : undefined,
          conteudo: backendErrors.conteudo ? "Verifique o conteúdo informado." : undefined,
        });
        setFormError("Verifique os campos e tente novamente.");
      } else {
        // 403 (sem permissão) e falhas de rede usam a mensagem do cliente HTTP;
        // um 401 já encerra a sessão no próprio cliente.
        setFormError(error instanceof ApiError ? error.message : "Erro inesperado ao publicar o post.");
      }
      setIsSubmitting(false);
    }
  }

  return {
    titulo,
    conteudo,
    fieldErrors,
    formError,
    isSubmitting,
    changeField,
    submit,
  };
}
