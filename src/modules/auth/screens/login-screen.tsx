import { SymbolView } from "expo-symbols";
import { useRef } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Radius, Shadow, Spacing, Typography, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
import { FormError } from "@/shared/ui/form-error";
import { TextField, type TextFieldRef } from "@/shared/ui/text-field";

import { useLogin } from "../hooks/use-login";

export function LoginScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const senhaRef = useRef<TextFieldRef>(null);
  const { email, senha, fieldErrors, formError, isSubmitting, changeField, submit } = useLogin();

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Topo institucional: marca do blog sobre o azul escuro. */}
        <View
          style={[
            styles.hero,
            {
              backgroundColor: theme.primaryDark,
              paddingTop: insets.top + Spacing.five,
            },
          ]}
        >
          <View style={[styles.logo, { backgroundColor: theme.accent }]}>
            <SymbolView
              name={{
                ios: "graduationcap.fill",
                android: "school",
                web: "school",
              }}
              tintColor={theme.onPrimary}
              size={32}
            />
          </View>
          <Text style={[Typography.display, { color: theme.onPrimary }]} accessibilityRole="header">
            TechMobile
          </Text>
          <Text style={[Typography.body, { color: theme.primarySoft }]}>
            Blog educacional · Pós Tech FIAP
          </Text>
        </View>

        <View style={styles.cardWrapper}>
          <View style={[styles.card, Shadow.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <Text style={[Typography.heading, { color: theme.text }]}>Acesse sua conta</Text>
              <Text style={[Typography.caption, { color: theme.textSecondary }]}>
                Entre com seu e-mail institucional e senha.
              </Text>
            </View>

            <FormError message={formError} />

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
        </View>

        <Text style={[Typography.caption, styles.footer, { color: theme.textSecondary }]}>
          Acesso para professores e alunos
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  hero: {
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    // Espaço extra embaixo para o cartão do formulário sobrepor o topo.
    paddingBottom: Spacing.five * 2,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  cardWrapper: {
    alignItems: "center",
    marginTop: -Spacing.five * 1.5,
    paddingHorizontal: Spacing.three,
  },
  card: {
    // Em telas largas (web/tablet), o formulário fica centralizado e não estica.
    width: "100%",
    maxWidth: 480,
    padding: Spacing.four,
    gap: Spacing.three,
    borderRadius: Radius.lg,
  },
  cardHeader: {
    gap: Spacing.one,
  },
  footer: {
    textAlign: "center",
    marginTop: Spacing.four,
  },
});
