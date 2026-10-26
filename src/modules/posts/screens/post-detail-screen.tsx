import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
import { EmptyState, ErrorState, Loading } from "@/shared/ui/state-views";

import { usePost } from "../hooks/use-post";
import { formatDate } from "../utils/format-date";

export function PostDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { post, status, error, retry } = usePost(id);

  function backToList() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }

  function renderBody() {
    if (status === "loading") {
      return <Loading message="Carregando post..." />;
    }

    if (status === "error") {
      return <ErrorState message={error ?? ""} onRetry={retry} />;
    }

    if (status === "not-found" || !post) {
      return (
        <View style={styles.notFound}>
          <EmptyState
            title="Post não encontrado"
            message="Ele pode ter sido removido ou o link está incorreto."
          />
          <Button title="Voltar para os posts" variant="secondary" onPress={backToList} />
        </View>
      );
    }

    const wasUpdated = post.data_atualizacao !== post.data_publicacao;

    return (
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
            {post.titulo}
          </Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            Publicado em {formatDate(post.data_publicacao)}
            {wasUpdated && ` · Atualizado em ${formatDate(post.data_atualizacao)}`}
          </Text>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <Text style={[styles.body, { color: theme.text }]} selectable>
            {post.conteudo}
          </Text>
        </View>
      </ScrollView>
    );
  }

  return <View style={[styles.container, { backgroundColor: theme.background }]}>{renderBody()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
  },
  card: {
    padding: Spacing.four,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.two,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 30,
  },
  meta: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.two,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  notFound: {
    flex: 1,
    padding: Spacing.four,
  },
});
