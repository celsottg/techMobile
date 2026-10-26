import { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Spacing, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
import { TextField, type TextFieldRef } from "@/shared/ui/text-field";

import { useLogin } from "../hooks/use-login";

export function LoginScreen() {
  const theme = useTheme();
  const senhaRef = useRef<TextFieldRef>(null);
  const { email, senha, fieldErrors, formError, isSubmitting, changeField, submit } = useLogin();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>TechMobile</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Entre com seu e-mail e senha para acessar os posts.
            </Text>
          </View>

          {formError && (
            <View
              style={[styles.formError, { borderColor: theme.danger }]}
              accessibilityRole="alert"
            >
              <Text style={{ color: theme.danger }}>{formError}</Text>
            </View>
          )}

          <View style={styles.form}>
            <TextField
              label="E-mail"
              value={email}
              onChangeText={(value) => changeField("email", value)}
              error={fieldErrors.email}
              placeholder="seu.nome@fiap.br"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => senhaRef.current?.focus()}
              editable={!isSubmitting}
            />
            <TextField
              ref={senhaRef}
              label="Senha"
              value={senha}
              onChangeText={(value) => changeField("senha", value)}
              error={fieldErrors.senha}
              placeholder="Sua senha"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={submit}
              editable={!isSubmitting}
            />
            <Button
              title={isSubmitting ? "Entrando..." : "Entrar"}
              onPress={submit}
              loading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: Spacing.four,
    padding: Spacing.four,
  },
  header: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  formError: {
    borderWidth: 1,
    borderRadius: 10,
    padding: Spacing.three,
  },
  form: {
    gap: Spacing.three,
  },
});
