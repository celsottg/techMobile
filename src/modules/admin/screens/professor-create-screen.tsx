import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

import { UsuarioForm } from "../components/usuario-form";
import { useCreateProfessor } from "../hooks/use-create-professor";

export function ProfessorCreateScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { nome, email, senha, fieldErrors, formError, isSubmitting, changeField, submit } =
    useCreateProfessor(() => {
      // Fecha o formulário e volta para a lista, que já recarrega com o novo professor.
      router.dismissTo("/admin/professores");
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
          emailPlaceholder="professor@fiap.br"
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
