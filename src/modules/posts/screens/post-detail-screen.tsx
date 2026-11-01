import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Radius, Shadow, Spacing, Typography, useTheme } from "@/shared/theme";
import { Badge } from "@/shared/ui/badge";
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
        <View
          style={[
            styles.card,
            Shadow.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Badge label="Post" />
          <Text style={[Typography.title, { color: theme.text }]} accessibilityRole="header">
            {post.titulo}
          </Text>
          <View style={styles.meta}>
            <Text style={[Typography.caption, { color: theme.textSecondary }]}>
              Publicado em {formatDate(post.data_publicacao)}
            </Text>
            {wasUpdated && (
              <Badge
                label={`Atualizado em ${formatDate(post.data_atualizacao)}`}
                variant="accent"
              />
            )}
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <Text style={[Typography.reading, { color: theme.text }]} selectable>
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
    // Largura de leitura confortável em telas largas (web/tablet).
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.two,
  },
  notFound: {
    flex: 1,
    padding: Spacing.four,
  },
});
