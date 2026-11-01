import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { Radius, Spacing, Typography, useTheme } from "@/shared/theme";

// Erro geral de um formulário (ex.: falha no envio), mostrado acima dos campos.
export function FormError({ message }: { message: string | null }) {
  const theme = useTheme();
  if (!message) return null;

  return (
    <View
      style={[styles.box, { backgroundColor: theme.dangerSoft, borderColor: theme.danger }]}
      accessible
      accessibilityRole="alert"
    >
      <SymbolView
        name={{ ios: "exclamationmark.circle", android: "error", web: "error" }}
        tintColor={theme.danger}
        size={20}
      />
      <Text style={[Typography.body, styles.text, { color: theme.danger }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  text: {
    flex: 1,
  },
});
