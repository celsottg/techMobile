import { Stack } from "expo-router";

import { SignOutButton } from "@/modules/auth";

// Aba Admin: área do professor. Cada cadastro é uma seção em admin/<secao>/.
export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Admin", headerRight: () => <SignOutButton /> }}
      />
      <Stack.Screen name="posts/index" options={{ title: "Posts", headerBackTitle: "Admin" }} />
      <Stack.Screen
        name="posts/create"
        options={{ title: "Novo post", headerBackTitle: "Posts" }}
      />
      <Stack.Screen
        name="posts/[id]/edit"
        options={{ title: "Editar post", headerBackTitle: "Posts" }}
      />
      <Stack.Screen
        name="professores/index"
        options={{ title: "Professores", headerBackTitle: "Admin" }}
      />
      <Stack.Screen
        name="professores/create"
        options={{ title: "Novo professor", headerBackTitle: "Professores" }}
      />
    </Stack>
  );
}
