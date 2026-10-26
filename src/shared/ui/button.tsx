import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;
  const textColor = isPrimary ? theme.onPrimary : theme.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        isPrimary
          ? { backgroundColor: theme.primary }
          : { borderColor: theme.primary, borderWidth: 1 },
        { opacity: isDisabled ? 0.6 : pressed ? 0.8 : 1 },
      ]}
    >
      {loading && <ActivityIndicator color={textColor} />}
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
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
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
