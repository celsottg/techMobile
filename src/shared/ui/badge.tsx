import { StyleSheet, Text, View } from "react-native";

import { Radius, Spacing, Typography, useTheme } from "@/shared/theme";

type BadgeProps = {
  label: string;
  variant?: "primary" | "accent";
};

// Etiqueta pequena em caixa alta, como "PROFESSOR", "POST" ou "ATUALIZADO".
export function Badge({ label, variant = "primary" }: BadgeProps) {
  const theme = useTheme();
  const isAccent = variant === "accent";

  return (
    <View
      style={[styles.badge, { backgroundColor: isAccent ? theme.accentSoft : theme.primarySoft }]}
    >
      <Text style={[Typography.overline, { color: isAccent ? theme.accentDark : theme.primary }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
});
