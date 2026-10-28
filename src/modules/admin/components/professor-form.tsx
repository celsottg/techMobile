import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
import { TextField, type TextFieldRef } from "@/shared/ui/text-field";

import type { CreateProfessorInput } from "../types";

type Field = keyof CreateProfessorInput;

type ProfessorFormProps = CreateProfessorInput & {
  fieldErrors: Partial<Record<Field, string>>;
  formError: string | null;
  isSubmitting: boolean;
  submitTitle: string;
  submittingTitle: string;
  onChangeField: (field: Field, value: string) => void;
  onSubmit: () => void;
};

// Campos de um professor (nome, email e senha).
export function ProfessorForm({
  nome,
  email,
  senha,
  fieldErrors,
  formError,
  isSubmitting,
  submitTitle,
  submittingTitle,
  onChangeField,
  onSubmit,
}: ProfessorFormProps) {
  const theme = useTheme();
  const emailRef = useRef<TextFieldRef>(null);
  const senhaRef = useRef<TextFieldRef>(null);

  return (
    <View style={styles.form}>
      {formError && (
        <View style={[styles.formError, { borderColor: theme.danger }]} accessibilityRole="alert">
          <Text style={{ color: theme.danger }}>{formError}</Text>
        </View>
      )}

      <TextField
        label="Nome"
        value={nome}
        onChangeText={(value) => onChangeField("nome", value)}
        error={fieldErrors.nome}
        placeholder="Nome completo"
        autoCapitalize="words"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => emailRef.current?.focus()}
        editable={!isSubmitting}
      />
      <TextField
        ref={emailRef}
        label="Email"
        value={email}
        onChangeText={(value) => onChangeField("email", value)}
        error={fieldErrors.email}
        placeholder="professor@fiap.br"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => senhaRef.current?.focus()}
        editable={!isSubmitting}
      />
      <TextField
        ref={senhaRef}
        label="Senha"
        value={senha}
        onChangeText={(value) => onChangeField("senha", value)}
        error={fieldErrors.senha}
        placeholder="Mínimo de 6 caracteres"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
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
});
