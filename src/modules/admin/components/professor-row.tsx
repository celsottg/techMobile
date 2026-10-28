import { StyleSheet, Text, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

import type { Professor } from "../types";

// Nome e email de um professor na listagem.
export function ProfessorRow({ professor }: { professor: Professor }) {
  const theme = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {professor.nome}
      </Text>
      <Text style={[styles.email, { color: theme.textSecondary }]} numberOfLines={1}>
        {professor.email}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: Spacing.three,
    gap: Spacing.one,
    borderRadius: 12,
    borderWidth: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  email: {
    fontSize: 14,
  },
});
