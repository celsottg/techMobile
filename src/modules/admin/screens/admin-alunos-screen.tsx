import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";
import { EmptyState, ErrorState, Loading } from "@/shared/ui/state-views";

import { AlunoRow } from "../components/aluno-row";
import { useAlunos } from "../hooks/use-alunos";
import { useDeleteAluno } from "../hooks/use-delete-aluno";

// Gestão de alunos: lista, com editar (lápis) e excluir (lixeira).
export function AdminAlunosScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { alunos, status, error, isRefreshing, isLoadingMore, retry, refresh, loadMore } =
    useAlunos();
  const { deletingId, remove } = useDeleteAluno();

  function renderBody() {
    if (status === "loading") {
      return <Loading message="Carregando alunos..." />;
    }

    if (status === "error") {
      return <ErrorState message={error ?? ""} onRetry={retry} />;
    }

    return (
      <FlatList
        data={alunos}
        keyExtractor={(aluno) => String(aluno.id)}
        renderItem={({ item }) => (
          <AlunoRow
            aluno={item}
            isDeleting={deletingId === item.id}
            onEdit={() =>
              router.push({
                pathname: "/admin/alunos/[id]/edit",
                params: { id: String(item.id) },
              })
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
          <EmptyState title="Nenhum aluno cadastrado" message="Os alunos cadastrados aparecem aqui." />
        }
        ListFooterComponent={
          isLoadingMore ? <ActivityIndicator style={styles.footer} color={theme.primary} /> : undefined
        }
      />
    );
  }

  return <View style={[styles.container, { backgroundColor: theme.background }]}>{renderBody()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
