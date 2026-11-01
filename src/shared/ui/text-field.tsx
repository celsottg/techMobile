import { useState, type ComponentRef, type Ref } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { Radius, Spacing, Typography, useTheme } from "@/shared/theme";

export type TextFieldRef = ComponentRef<typeof TextInput>;

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  ref?: Ref<TextFieldRef>;
};

export function TextField({ label, error, style, onFocus, onBlur, ...inputProps }: TextFieldProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = error ? theme.danger : isFocused ? theme.primary : theme.border;

  return (
    <View style={styles.container}>
      <Text style={[Typography.label, { color: theme.text }]}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        accessibilityLabel={label}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          { backgroundColor: theme.card, borderColor, color: theme.text },
          style,
        ]}
        {...inputProps}
      />
      {error && <Text style={[Typography.caption, { color: theme.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one + 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 4,
    fontSize: Typography.body.fontSize,
  },
});
