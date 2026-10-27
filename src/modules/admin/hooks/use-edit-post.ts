import { useState } from "react";

import {
  updatePost,
  usePost,
  type CreatePostInput,
  type Post,
} from "@/modules/posts";
import { ApiError } from "@/shared/api/http-client";

type Field = keyof CreatePostInput;
type FieldErrors = Partial<Record<Field, string>>;

function validate({ titulo, conteudo }: CreatePostInput): FieldErrors {
  const errors: FieldErrors = {};

  if (!titulo) errors.titulo = "Informe o título.";
  if (!conteudo) errors.conteudo = "Informe o conteúdo.";

  return errors;
}

/** Edição de post (GET /posts/:id para preencher e PUT /posts/:id para salvar, só PROFESSOR). */
export function useEditPost(id: string | undefined, onUpdated: (post: Post) => void) {
  const { post, status, error, retry } = usePost(id);

  // O que o usuário digitou; enquanto for null, o campo mostra o valor atual do post.
  const [tituloEdit, setTituloEdit] = useState<string | null>(null);
  const [conteudoEdit, setConteudoEdit] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titulo = tituloEdit ?? post?.titulo ?? "";
  const conteudo = conteudoEdit ?? post?.conteudo ?? "";

  function changeField(field: Field, value: string) {
    if (field === "titulo") setTituloEdit(value);
    else setConteudoEdit(value);

    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
    setFormError(null);
  }

  async function submit() {
    if (isSubmitting || !post) return;

    const input = { titulo: titulo.trim(), conteudo: conteudo.trim() };
    const errors = validate(input);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const updated = await updatePost(post.id, input);
      onUpdated(updated);
    } catch (e) {
      if (e instanceof ApiError && e.status === 400) {
        const backendErrors = e.fieldErrors ?? {};
        setFieldErrors({
          titulo: backendErrors.titulo ? "Verifique o título informado." : undefined,
          conteudo: backendErrors.conteudo ? "Verifique o conteúdo informado." : undefined,
        });
        setFormError("Verifique os campos e tente novamente.");
      } else if (e instanceof ApiError && e.status === 404) {
        setFormError("Este post não existe mais.");
      } else {
        setFormError(e instanceof ApiError ? e.message : "Erro inesperado ao salvar o post.");
      }
      setIsSubmitting(false);
    }
  }

  return {
    status,
    error,
    retry,
    titulo,
    conteudo,
    fieldErrors,
    formError,
    isSubmitting,
    changeField,
    submit,
  };
}
