import { StyleSheet, Text, View } from "react-native";

import { Spacing, Typography, useTheme } from "@/shared/theme";

import { Button } from "./button";

type ListHeaderProps = {
  // Sem total (lista carregando ou com erro), mostra só o botão.
  total?: number;
  singular: string;
  plural: string;
  // Botão de criação ao lado do total (ex.: "Novo aluno").
  action?: { title: string; onPress: () => void };
};

// Cabeçalho das listas: total de itens ("12 alunos") e, opcionalmente, o botão de criar.
export function ListHeader({ total, singular, plural, action }: ListHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {total !== undefined && (
        <View style={styles.info}>
          <Text style={[Typography.overline, { color: theme.textSecondary }]}>Total</Text>
          <Text style={[Typography.heading, { color: theme.text }]}>
            {total} {total === 1 ? singular : plural}
          </Text>
        </View>
      )}
      {action && (
        <View style={styles.action}>
          <Button title={action.title} onPress={action.onPress} size="compact" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  info: {
    flexShrink: 1,
  },
  action: {
    marginLeft: "auto",
  },
});
