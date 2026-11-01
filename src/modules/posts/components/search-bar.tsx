import { SymbolView } from "expo-symbols";
import { StyleSheet, TextInput, View } from "react-native";

import { Radius, Shadow, Spacing, Typography, useTheme } from "@/shared/theme";

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        Shadow.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <SymbolView
        name={{ ios: "magnifyingglass", android: "search", web: "search" }}
        tintColor={theme.textSecondary}
        size={18}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar por título ou conteúdo"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
        style={[styles.input, { color: theme.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.two + 4,
    fontSize: Typography.body.fontSize,
  },
});
