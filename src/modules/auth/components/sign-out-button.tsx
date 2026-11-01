import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text } from "react-native";

import { useSession } from "@/shared/session";
import { Spacing, Typography, useTheme } from "@/shared/theme";

// Fica no cabeçalho azul das abas, por isso usa a cor sobre primary.
export function SignOutButton() {
  const theme = useTheme();
  const { signOut } = useSession();

  return (
    <Pressable
      onPress={signOut}
      accessibilityRole="button"
      accessibilityLabel="Sair"
      hitSlop={8}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
    >
      <SymbolView
        name={{
          ios: "rectangle.portrait.and.arrow.right",
          android: "logout",
          web: "logout",
        }}
        tintColor={theme.onPrimary}
        size={18}
      />
      <Text style={[Typography.label, { color: theme.onPrimary }]}>Sair</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
});
