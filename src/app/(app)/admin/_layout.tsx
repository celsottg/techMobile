import { Stack } from "expo-router";

import { SignOutButton } from "@/modules/auth";
import { useTheme } from "@/shared/theme";
import { stackHeaderOptions } from "@/shared/ui/stack-header";

// Aba Gestão (rota admin): área do professor. Cada cadastro é uma seção em admin/<secao>/.
export default function AdminLayout() {
  const theme = useTheme();

  return (
    <Stack screenOptions={stackHeaderOptions(theme)}>
      <Stack.Screen
        name="index"
        options={{ title: "Gestão", headerRight: () => <SignOutButton /> }}
      />
      <Stack.Screen name="posts/index" options={{ title: "Posts", headerBackTitle: "Gestão" }} />
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
        options={{ title: "Professores", headerBackTitle: "Gestão" }}
      />
      <Stack.Screen
        name="professores/create"
        options={{ title: "Novo professor", headerBackTitle: "Professores" }}
      />
      <Stack.Screen
        name="professores/[id]/edit"
        options={{ title: "Editar professor", headerBackTitle: "Professores" }}
      />
      <Stack.Screen name="alunos/index" options={{ title: "Alunos", headerBackTitle: "Gestão" }} />
      <Stack.Screen
        name="alunos/create"
        options={{ title: "Novo aluno", headerBackTitle: "Alunos" }}
      />
      <Stack.Screen
        name="alunos/[id]/edit"
        options={{ title: "Editar aluno", headerBackTitle: "Alunos" }}
      />
    </Stack>
  );
}
