import { Stack } from "expo-router";

import { SignOutButton } from "@/modules/auth";

// Aba Posts: leitura (ALUNO e PROFESSOR). O grupo (posts) não aparece na URL.
export default function PostsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Posts", headerRight: () => <SignOutButton /> }}
      />
      <Stack.Screen name="posts/[id]" options={{ title: "Post", headerBackTitle: "Posts" }} />
    </Stack>
  );
}
