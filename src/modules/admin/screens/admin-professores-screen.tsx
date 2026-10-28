import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";
import { Button } from "@/shared/ui/button";
import { EmptyState, ErrorState, Loading } from "@/shared/ui/state-views";

import { ProfessorRow } from "../components/professor-row";
import { useDeleteProfessor } from "../hooks/use-delete-professor";
import { useProfessores } from "../hooks/use-professores";

// Gestão de professores: lista, com criar, editar (lápis) e excluir (lixeira).
export function AdminProfessoresScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { professores, status, error, isRefreshing, isLoadingMore, retry, refresh, loadMore } =
    useProfessores();
  const { deletingId, remove } = useDeleteProfessor();

  function renderBody() {
    if (status === "loading") {
      return <Loading message="Carregando professores..." />;
    }

    if (status === "error") {
      return <ErrorState message={error ?? ""} onRetry={retry} />;
    }

    return (
      <FlatList
        data={professores}
        keyExtractor={(professor) => String(professor.id)}
        renderItem={({ item }) => (
          <ProfessorRow
            professor={item}
            isDeleting={deletingId === item.id}
            onEdit={() =>
              router.push({
                pathname: "/admin/professores/[id]/edit",
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
          <EmptyState
            title="Nenhum professor cadastrado"
            message="Toque em Novo professor para cadastrar o primeiro."
          />
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
        <Button title="Novo professor" onPress={() => router.push("/admin/professores/create")} />
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
