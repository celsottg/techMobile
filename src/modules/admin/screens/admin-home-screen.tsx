import { useRouter, type Href } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

type Section = {
  title: string;
  description: string;
  href: Href;
};

// Cadastros da área do professor. Cada novo cadastro entra aqui e em src/app/(app)/admin/<secao>/.
const SECTIONS: Section[] = [
  { title: "Posts", description: "Criar e gerenciar posts", href: "/admin/posts" },
  {
    title: "Professores",
    description: "Ver e cadastrar professores",
    href: "/admin/professores",
  },
];

export function AdminHomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.list}
      data={SECTIONS}
      keyExtractor={(section) => section.title}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push(item.href)}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          accessibilityHint={item.description}
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: theme.card, borderColor: pressed ? theme.primary : theme.border },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {item.description}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.three,
  },
  separator: {
    height: Spacing.three,
  },
  card: {
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.one,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
  },
});
