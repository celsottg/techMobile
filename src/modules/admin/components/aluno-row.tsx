import { StyleSheet, Text, View } from "react-native";

import { Radius, Shadow, Spacing, Typography, useTheme } from "@/shared/theme";
import { Avatar } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { IconButton } from "@/shared/ui/icon-button";

import type { Aluno } from "../types";

type AlunoRowProps = {
  aluno: Aluno;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

// Avatar, nome e email de um aluno na listagem,
// com os atalhos de editar (lápis) e excluir (lixeira).
export function AlunoRow({ aluno, isDeleting, onEdit, onDelete }: AlunoRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        Shadow.card,
        { backgroundColor: theme.card, borderColor: theme.border, opacity: isDeleting ? 0.5 : 1 },
      ]}
    >
      <Avatar name={aluno.nome} />
      <View style={styles.info}>
        <Text style={[Typography.bodyStrong, { color: theme.text }]} numberOfLines={1}>
          {aluno.nome}
        </Text>
        <Text style={[Typography.caption, { color: theme.textSecondary }]} numberOfLines={1}>
          {aluno.email}
        </Text>
        <Badge label="Aluno" />
      </View>
      <View style={styles.actions}>
        <IconButton
          icon={{ ios: "pencil", android: "edit", web: "edit" }}
          label={`Editar ${aluno.nome}`}
          onPress={onEdit}
          disabled={isDeleting}
        />
        <IconButton
          icon={{ ios: "trash", android: "delete", web: "delete" }}
          label={`Excluir ${aluno.nome}`}
          onPress={onDelete}
          tone="danger"
          disabled={isDeleting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
});
