import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
import { EmptyState, ErrorState, Loading } from "@/shared/ui/state-views";

import { PostForm } from "../components/post-form";
import { useEditPost } from "../hooks/use-edit-post";

export function PostEditScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
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
  } = useEditPost(id, () => {
    // Volta para a lista de gestão; as listas e o detalhe já recarregam com o post atualizado.
    router.dismissTo("/admin/posts");
  });

  function renderBody() {
    if (status === "loading") {
      return <Loading message="Carregando post..." />;
    }

    if (status === "error") {
      return <ErrorState message={error ?? ""} onRetry={retry} />;
    }

    if (status === "not-found") {
      return (
        <View style={styles.notFound}>
          <EmptyState
            title="Post não encontrado"
            message="Ele pode ter sido removido ou o link está incorreto."
          />
          <Button
            title="Voltar para os posts"
            variant="secondary"
            onPress={() => router.dismissTo("/admin/posts")}
          />
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PostForm
          titulo={titulo}
          conteudo={conteudo}
          fieldErrors={fieldErrors}
          formError={formError}
          isSubmitting={isSubmitting}
          submitTitle="Salvar alterações"
          submittingTitle="Salvando..."
          onChangeField={changeField}
          onSubmit={submit}
        />
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {renderBody()}
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
  notFound: {
    flex: 1,
    padding: Spacing.four,
  },
});
