import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";
import { EmptyState, ErrorState, Loading } from "@/shared/ui/state-views";

import { PostCard } from "../components/post-card";
import { SearchBar } from "../components/search-bar";
import { usePosts } from "../hooks/use-posts";

export function PostListScreen() {
  const theme = useTheme();
  const {
    posts,
    status,
    error,
    search,
    term,
    isRefreshing,
    isLoadingMore,
    setSearch,
    retry,
    refresh,
    loadMore,
  } = usePosts();

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
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListEmptyComponent={
          term ? (
            <EmptyState title="Nenhum resultado" message={`Nenhum post encontrado para "${term}".`} />
          ) : (
            <EmptyState title="Nenhum post publicado" message="Ainda não há posts por aqui." />
          )
        }
        ListFooterComponent={
          isLoadingMore ? <ActivityIndicator style={styles.footer} color={theme.primary} /> : undefined
        }
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchContainer}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>
      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  list: {
    flexGrow: 1,
    padding: Spacing.three,
  },
  separator: {
    height: Spacing.three,
  },
  footer: {
    paddingVertical: Spacing.three,
  },
});
