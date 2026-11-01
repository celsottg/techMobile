import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Radius, Shadow, Spacing, Typography, useTheme } from "@/shared/theme";
import { Badge } from "@/shared/ui/badge";

import type { Post } from "../types";
import { formatDate } from "../utils/format-date";

type PostCardProps = {
  post: Post;
  onPress: () => void;
};

export function PostCard({ post, onPress }: PostCardProps) {
  const theme = useTheme();
  const wasUpdated = post.data_atualizacao !== post.data_publicacao;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={post.titulo}
      accessibilityHint="Abre o post completo"
      style={({ pressed }) => [
        styles.card,
        Shadow.card,
        {
          backgroundColor: theme.card,
          // Card pressionado = post selecionado, destacado com a cor primária.
          borderColor: pressed ? theme.primary : theme.border,
        },
      ]}
    >
      {/* Faixa dourada à esquerda, marca visual dos posts do blog. */}
      <View style={[styles.strip, { backgroundColor: theme.accent }]} />
      <View style={styles.body}>
        <View style={styles.meta}>
          <SymbolView
            name={{
              ios: "calendar",
              android: "calendar_today",
              web: "calendar_today",
            }}
            tintColor={theme.textSecondary}
            size={14}
          />
          <Text style={[Typography.caption, styles.date, { color: theme.textSecondary }]}>
            Publicado em {formatDate(post.data_publicacao)}
          </Text>
          {wasUpdated && <Badge label="Atualizado" variant="accent" />}
        </View>
        <Text style={[Typography.heading, { color: theme.text }]} numberOfLines={2}>
          {post.titulo}
        </Text>
        <Text style={[Typography.body, { color: theme.textSecondary }]} numberOfLines={3}>
          {post.conteudo}
        </Text>
        <Text style={[Typography.label, { color: theme.primary }]}>Ler post ›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  strip: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.one + 2,
  },
  date: {
    marginRight: Spacing.one,
  },
});
