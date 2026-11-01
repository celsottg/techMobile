import { StyleSheet, Text, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

import type { Aluno } from "../types";

type AlunoRowProps = {
  aluno: Aluno;
};

// Nome e email de um aluno na listagem (só leitura, por enquanto).
export function AlunoRow({ aluno }: AlunoRowProps) {
  const theme = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {aluno.nome}
      </Text>
      <Text style={[styles.email, { color: theme.textSecondary }]} numberOfLines={1}>
        {aluno.email}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
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
