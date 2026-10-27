import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import type { CreatePostInput } from "@/modules/posts";
import { Spacing, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
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
    <View style={styles.form}>
      {formError && (
        <View style={[styles.formError, { borderColor: theme.danger }]} accessibilityRole="alert">
          <Text style={{ color: theme.danger }}>{formError}</Text>
        </View>
      )}

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
    gap: Spacing.three,
  },
  formError: {
    borderWidth: 1,
    borderRadius: 10,
    padding: Spacing.three,
  },
  conteudo: {
    minHeight: 200,
  },
});
