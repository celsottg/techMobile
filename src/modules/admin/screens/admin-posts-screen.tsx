import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { usePosts } from "@/modules/posts";
import { Spacing, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
import { EmptyState, ErrorState, Loading } from "@/shared/ui/state-views";

// Gestão de posts do professor. Por enquanto só lista os títulos; editar e remover vêm depois.
export function AdminPostsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { posts, status, error, isRefreshing, isLoadingMore, retry, refresh, loadMore } =
    usePosts();

  function renderBody() {
    if (status === "loading") {
      return <Loading message="Carregando posts..." />;
    }

    if (status === "error") {
      return <ErrorState message={error ?? ""} onRetry={retry} />;
    }

    return (
      <FlatList
        data={posts}
        keyExtractor={(post) => String(post.id)}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
              {item.titulo}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListEmptyComponent={
          <EmptyState title="Nenhum post publicado" message="Toque em Novo post para criar o primeiro." />
        }
        ListFooterComponent={
          isLoadingMore ? <ActivityIndicator style={styles.footer} color={theme.primary} /> : undefined
        }
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.actions}>
        <Button title="Novo post" onPress={() => router.push("/admin/posts/create")} />
      </View>
      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actions: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  list: {
    flexGrow: 1,
    padding: Spacing.three,
  },
  separator: {
    height: Spacing.two,
  },
  row: {
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    paddingVertical: Spacing.three,
  },
});
