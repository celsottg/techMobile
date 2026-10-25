import { StyleSheet, TextInput } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  const theme = useTheme();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Buscar por título ou conteúdo"
      placeholderTextColor={theme.textSecondary}
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode="while-editing"
      returnKeyType="search"
      style={[
        styles.input,
        { backgroundColor: theme.card, borderColor: theme.border, color: theme.text },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 16,
  },
});
