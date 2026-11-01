import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
import { EmptyState, ErrorState, Loading } from "@/shared/ui/state-views";

import { UsuarioForm } from "../components/usuario-form";
import { useEditAluno } from "../hooks/use-edit-aluno";

export function AlunoEditScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    status,
    error,
    retry,
    nome,
    email,
    senha,
    fieldErrors,
    formError,
    isSubmitting,
    changeField,
    submit,
  } = useEditAluno(id, () => {
    // Volta para a lista, que já recarrega com o aluno atualizado.
    router.dismissTo("/admin/alunos");
  });

  function renderBody() {
    if (status === "loading") {
      return <Loading message="Carregando aluno..." />;
    }

    if (status === "error") {
      return <ErrorState message={error ?? ""} onRetry={retry} />;
    }

    if (status === "not-found") {
      return (
        <View style={styles.notFound}>
          <EmptyState
            title="Aluno não encontrado"
            message="Ele pode ter sido removido ou o link está incorreto."
          />
          <Button
            title="Voltar para os alunos"
            variant="secondary"
            onPress={() => router.dismissTo("/admin/alunos")}
          />
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <UsuarioForm
          nome={nome}
          email={email}
          senha={senha}
          fieldErrors={fieldErrors}
          formError={formError}
          isSubmitting={isSubmitting}
          submitTitle="Salvar alterações"
          emailPlaceholder="aluno@fiap.br"
          submittingTitle="Salvando..."
          senhaOptional
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
