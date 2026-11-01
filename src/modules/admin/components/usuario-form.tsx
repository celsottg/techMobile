import { useRef } from "react";
import { StyleSheet, View } from "react-native";

import { Radius, Shadow, Spacing, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
import { FormError } from "@/shared/ui/form-error";
import { TextField, type TextFieldRef } from "@/shared/ui/text-field";

type UsuarioFormValues = {
  nome: string;
  email: string;
  senha: string;
};

type Field = keyof UsuarioFormValues;

type UsuarioFormProps = UsuarioFormValues & {
  fieldErrors: Partial<Record<Field, string>>;
  formError: string | null;
  isSubmitting: boolean;
  submitTitle: string;
  submittingTitle: string;
  emailPlaceholder: string;
  // Na edição, deixar a senha em branco mantém a atual.
  senhaOptional?: boolean;
  onChangeField: (field: Field, value: string) => void;
  onSubmit: () => void;
};

// Campos de um usuário (professor ou aluno): nome, email e senha.
export function UsuarioForm({
  nome,
  email,
  senha,
  fieldErrors,
  formError,
  isSubmitting,
  submitTitle,
  submittingTitle,
  emailPlaceholder,
  senhaOptional = false,
  onChangeField,
  onSubmit,
}: UsuarioFormProps) {
  const theme = useTheme();
  const emailRef = useRef<TextFieldRef>(null);
  const senhaRef = useRef<TextFieldRef>(null);

  return (
    <View
      style={[styles.form, Shadow.card, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <FormError message={formError} />

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
        placeholder={emailPlaceholder}
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
        label={senhaOptional ? "Nova senha (opcional)" : "Senha"}
        value={senha}
        onChangeText={(value) => onChangeField("senha", value)}
        error={fieldErrors.senha}
        placeholder={senhaOptional ? "Deixe em branco para manter a atual" : "Mínimo de 6 caracteres"}
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
    // Cartão centralizado e com largura limitada em telas largas (web/tablet).
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    gap: Spacing.three,
    padding: Spacing.four,
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
});
