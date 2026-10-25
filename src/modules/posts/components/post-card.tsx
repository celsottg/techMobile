import { StyleSheet, Text, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

import type { Post } from "../types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });

function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function PostCard({ post }: { post: Post }) {
  const theme = useTheme();
  const wasUpdated = post.data_atualizacao !== post.data_publicacao;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
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
