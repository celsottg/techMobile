import { Stack } from "expo-router";

// Área autenticada do app (pós-login). O grupo (app) não aparece na URL.
export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Posts" }} />
    </Stack>
  );
}
