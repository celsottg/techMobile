import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { usePosts } from "@/modules/posts";
import { Spacing, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
import { EmptyState, ErrorState, Loading } from "@/shared/ui/state-views";

import { AdminPostRow } from "../components/admin-post-row";
import { useDeletePost } from "../hooks/use-delete-post";

// Gestão de posts do professor: lista os títulos, com criar, editar (lápis) e excluir (lixeira).
export function AdminPostsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { posts, status, error, isRefreshing, isLoadingMore, retry, refresh, loadMore } =
    usePosts();
  const { deletingId, remove } = useDeletePost();

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
          <AdminPostRow
            post={item}
            isDeleting={deletingId === item.id}
            onEdit={() =>
              router.push({ pathname: "/admin/posts/[id]/edit", params: { id: String(item.id) } })
            }
            onDelete={() => remove(item)}
          />
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
  footer: {
    paddingVertical: Spacing.three,
  },
});
