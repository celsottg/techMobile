import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { Radius, Spacing, Typography, useTheme } from "@/shared/theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  // compact: botão menor, para ficar ao lado de outros elementos (ex.: cabeçalho de lista).
  size?: "regular" | "compact";
  loading?: boolean;
  disabled?: boolean;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "regular",
  loading = false,
  disabled = false,
}: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;
  const outlineColor = variant === "danger" ? theme.danger : theme.primary;
  const textColor = isPrimary ? theme.onPrimary : outlineColor;
  const textStyle = size === "compact" ? Typography.label : Typography.bodyStrong;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        size === "compact" && styles.compact,
        isPrimary
          ? { backgroundColor: pressed ? theme.primaryDark : theme.primary }
          : {
              backgroundColor: pressed ? theme.primarySoft : theme.card,
              borderColor: textColor,
              borderWidth: 1,
            },
        { opacity: isDisabled ? 0.6 : 1 },
      ]}
    >
      {loading && <ActivityIndicator color={textColor} />}
      <Text style={[textStyle, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    minHeight: 48,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.md,
  },
  compact: {
    minHeight: 40,
    paddingHorizontal: Spacing.three,
  },
});
