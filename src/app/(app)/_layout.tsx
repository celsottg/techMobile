import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";

import { useSession } from "@/shared/session";
import { useTheme } from "@/shared/theme";

// Área autenticada do app (pós-login). O grupo (app) não aparece na URL.
export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Posts", headerRight: () => <SignOutButton /> }}
      />
    </Stack>
  );
}

function SignOutButton() {
  const theme = useTheme();
  const { signOut } = useSession();

  return (
    <Pressable onPress={signOut} accessibilityRole="button" hitSlop={8}>
      <Text style={{ color: theme.primary, fontSize: 16, fontWeight: "600" }}>Sair</Text>
    </Pressable>
  );
}
