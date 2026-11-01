import { StyleSheet, Text, View } from "react-native";

import { Radius, Typography, useTheme } from "@/shared/theme";

// Iniciais do primeiro e do último nome ("Ana Beatriz Silva" → "AS").
export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// Círculo com as iniciais da pessoa, usado nas listas de professores e alunos.
export function Avatar({ name }: { name: string }) {
  const theme = useTheme();

  return (
    <View
      style={[styles.circle, { backgroundColor: theme.primarySoft }]}
      // Decorativo: o nome já aparece ao lado.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={[Typography.label, { color: theme.primary }]}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
