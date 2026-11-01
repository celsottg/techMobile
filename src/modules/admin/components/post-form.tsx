import { useRef } from "react";
import { StyleSheet, View } from "react-native";

import type { CreatePostInput } from "@/modules/posts";
import { Radius, Shadow, Spacing, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
import { FormError } from "@/shared/ui/form-error";
import { TextField, type TextFieldRef } from "@/shared/ui/text-field";

type Field = keyof CreatePostInput;

type PostFormProps = CreatePostInput & {
  fieldErrors: Partial<Record<Field, string>>;
  formError: string | null;
  isSubmitting: boolean;
  submitTitle: string;
  submittingTitle: string;
  onChangeField: (field: Field, value: string) => void;
  onSubmit: () => void;
};

// Campos de um post (título e conteúdo); serve para criar e, depois, editar.
export function PostForm({
  titulo,
  conteudo,
  fieldErrors,
  formError,
  isSubmitting,
  submitTitle,
  submittingTitle,
  onChangeField,
  onSubmit,
}: PostFormProps) {
  const theme = useTheme();
  const conteudoRef = useRef<TextFieldRef>(null);

  return (
    <View
      style={[styles.form, Shadow.card, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <FormError message={formError} />

      <TextField
        label="Título"
        value={titulo}
        onChangeText={(value) => onChangeField("titulo", value)}
        error={fieldErrors.titulo}
        placeholder="Título do post"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => conteudoRef.current?.focus()}
        editable={!isSubmitting}
      />
      <TextField
        ref={conteudoRef}
        label="Conteúdo"
        value={conteudo}
        onChangeText={(value) => onChangeField("conteudo", value)}
        error={fieldErrors.conteudo}
        placeholder="Escreva o conteúdo do post"
        multiline
        textAlignVertical="top"
        style={styles.conteudo}
        editable={!isSubmitting}
      />
      <Button
        title={isSubmitting ? submittingTitle : submitTitle}
        onPress={onSubmit}
        loading={isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    // Cartão centralizado e com largura limitada em telas largas (web/tablet).
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    gap: Spacing.three,
    padding: Spacing.four,
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  conteudo: {
    minHeight: 240,
  },
});
