import { SymbolView } from "expo-symbols";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Radius, useTheme } from "@/shared/theme";

// Nome do ícone por plataforma (SF Symbols no iOS, Material Symbols no Android e na web).
export type IconName = ComponentProps<typeof SymbolView>["name"];

type IconButtonProps = {
  icon: IconName;
  // Texto lido pelo leitor de tela (o botão não tem rótulo visível).
  label: string;
  onPress: () => void;
  tone?: "primary" | "danger";
  disabled?: boolean;
};

// Botão redondo só com ícone, como o lápis (editar) e a lixeira (excluir) das listas.
export function IconButton({
  icon,
  label,
  onPress,
  tone = "primary",
  disabled = false,
}: IconButtonProps) {
  const theme = useTheme();
  const color = tone === "danger" ? theme.danger : theme.primary;
  const background = tone === "danger" ? theme.dangerSoft : theme.primarySoft;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={4}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <SymbolView name={icon} tintColor={color} size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
