import { Stack } from "expo-router";

import { SignOutButton } from "@/modules/auth";
import { useTheme } from "@/shared/theme";
import { stackHeaderOptions } from "@/shared/ui/stack-header";

// Aba Blog: leitura (ALUNO e PROFESSOR). O grupo (posts) não aparece na URL.
export default function PostsLayout() {
  const theme = useTheme();

  return (
    <Stack screenOptions={stackHeaderOptions(theme)}>
      <Stack.Screen
        name="index"
        options={{ title: "Blog", headerRight: () => <SignOutButton /> }}
      />
      <Stack.Screen name="posts/[id]" options={{ title: "Post", headerBackTitle: "Blog" }} />
    </Stack>
  );
}
