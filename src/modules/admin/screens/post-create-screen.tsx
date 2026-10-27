import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

import { PostForm } from "../components/post-form";
import { useCreatePost } from "../hooks/use-create-post";

export function PostCreateScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { titulo, conteudo, fieldErrors, formError, isSubmitting, changeField, submit } =
    useCreatePost(() => {
      // Fecha o formulário e volta para a Home; a lista já recarrega com o novo post.
      router.dismissTo("/admin/posts");
      router.navigate("/");
    });

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PostForm
          titulo={titulo}
          conteudo={conteudo}
          fieldErrors={fieldErrors}
          formError={formError}
          isSubmitting={isSubmitting}
          submitTitle="Publicar"
          submittingTitle="Publicando..."
          onChangeField={changeField}
          onSubmit={submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
  },
});
