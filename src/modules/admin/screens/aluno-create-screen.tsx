import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

import { UsuarioForm } from "../components/usuario-form";
import { useCreateAluno } from "../hooks/use-create-aluno";

export function AlunoCreateScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { nome, email, senha, fieldErrors, formError, isSubmitting, changeField, submit } =
    useCreateAluno(() => {
      // Fecha o formulário e volta para a lista, que já recarrega com o novo aluno.
      router.dismissTo("/admin/alunos");
    });

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <UsuarioForm
          nome={nome}
          email={email}
          senha={senha}
          fieldErrors={fieldErrors}
          formError={formError}
          isSubmitting={isSubmitting}
          submitTitle="Cadastrar"
          emailPlaceholder="aluno@fiap.br"
          submittingTitle="Cadastrando..."
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
