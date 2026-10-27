import { Pressable, Text } from "react-native";

import { useSession } from "@/shared/session";
import { useTheme } from "@/shared/theme";

export function SignOutButton() {
  const theme = useTheme();
  const { signOut } = useSession();

  return (
    <Pressable onPress={signOut} accessibilityRole="button" hitSlop={8}>
      <Text style={{ color: theme.primary, fontSize: 16, fontWeight: "600" }}>Sair</Text>
    </Pressable>
  );
}
