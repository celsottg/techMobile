import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { Spacing, Typography, useTheme } from "@/shared/theme";
import { EmptyState, ErrorState, Loading } from "@/shared/ui/state-views";

import { PostCard } from "../components/post-card";
import { SearchBar } from "../components/search-bar";
import { usePosts } from "../hooks/use-posts";

export function PostListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const {
    posts,
    total,
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

  // Resumo acima da lista: total publicado ou quantos posts a busca encontrou.
  const found = posts.length === 1 ? "post encontrado" : "posts encontrados";
  const published = total === 1 ? "post publicado" : "posts publicados";
  const summary = term
    ? `${posts.length} ${found} para "${term}"`
    : `${total} ${published} pelos professores`;

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
          <PostCard
            post={item}
            onPress={() =>
              router.push({ pathname: "/posts/[id]", params: { id: String(item.id) } })
            }
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          posts.length > 0 ? (
            <View style={styles.sectionHeader}>
              <Text style={[Typography.overline, { color: theme.accentDark }]}>
                {term ? "Resultados da busca" : "Publicações recentes"}
              </Text>
              <Text style={[Typography.caption, { color: theme.textSecondary }]}>
                {summary}
              </Text>
            </View>
          ) : undefined
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListEmptyComponent={
          term ? (
            <EmptyState
              title="Nenhum resultado"
              message={`Nenhum post encontrado para "${term}".`}
              icon={{ ios: "magnifyingglass", android: "search_off", web: "search_off" }}
            />
          ) : (
            <EmptyState
              title="Nenhum post publicado"
              message="Ainda não há posts por aqui."
              icon={{ ios: "book", android: "menu_book", web: "menu_book" }}
            />
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
  sectionHeader: {
    gap: Spacing.one,
    marginBottom: Spacing.three,
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
