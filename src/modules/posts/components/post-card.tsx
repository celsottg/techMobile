import { Pressable, StyleSheet, Text } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

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
        {
          backgroundColor: theme.card,
          // Card pressionado = post selecionado, destacado com a cor primária.
          borderColor: pressed ? theme.primary : theme.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
        {post.titulo}
      </Text>
      <Text style={[styles.meta, { color: theme.textSecondary }]}>
        Publicado em {formatDate(post.data_publicacao)}
        {wasUpdated && ` · Atualizado em ${formatDate(post.data_atualizacao)}`}
      </Text>
      <Text style={[styles.content, { color: theme.text }]} numberOfLines={4}>
        {post.conteudo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.two,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  meta: {
    fontSize: 13,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
});
