import { useRouter, type Href } from "expo-router";
import { SymbolView } from "expo-symbols";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { useSession } from "@/shared/session";
import { Radius, Shadow, Spacing, Typography, useTheme } from "@/shared/theme";
import type { IconName } from "@/shared/ui/icon-button";
import { firstName } from "@/shared/utils/person-name";

type Section = {
  title: string;
  description: string;
  href: Href;
  icon: IconName;
};

// Cadastros da área do professor. Cada novo cadastro entra aqui e em src/app/(app)/admin/<secao>/.
const SECTIONS: Section[] = [
  {
    title: "Posts",
    description: "Criar e gerenciar posts",
    href: "/admin/posts",
    icon: { ios: "doc.text", android: "article", web: "article" },
  },
  {
    title: "Professores",
    description: "Ver e cadastrar professores",
    href: "/admin/professores",
    icon: { ios: "person.2", android: "co_present", web: "co_present" },
  },
  {
    title: "Alunos",
    description: "Ver e cadastrar alunos",
    href: "/admin/alunos",
    icon: { ios: "graduationcap", android: "school", web: "school" },
  },
];

export function AdminHomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { session } = useSession();
  const name = session ? firstName(session.usuario.nome) : "";

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.list}
      data={SECTIONS}
      keyExtractor={(section) => section.title}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={[Typography.display, { color: theme.text }]}>
            {name ? `Olá, ${name}` : "Olá"}
          </Text>
          <Text style={[Typography.body, { color: theme.textSecondary }]}>
            Gerencie as publicações e os cadastros da instituição.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push(item.href)}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          accessibilityHint={item.description}
          style={({ pressed }) => [
            styles.card,
            Shadow.card,
            { backgroundColor: theme.card, borderColor: pressed ? theme.primary : theme.border },
          ]}
        >
          <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
            <SymbolView name={item.icon} tintColor={theme.primary} size={24} />
          </View>
          <View style={styles.texts}>
            <Text style={[Typography.heading, { color: theme.text }]}>{item.title}</Text>
            <Text style={[Typography.caption, { color: theme.textSecondary }]}>
              {item.description}
            </Text>
          </View>
          <SymbolView
            name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
            tintColor={theme.textSecondary}
            size={18}
          />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.three,
  },
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.four,
  },
  separator: {
    height: Spacing.three,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    flex: 1,
    gap: Spacing.one,
  },
});
