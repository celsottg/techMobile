import { StyleSheet, Text, View } from "react-native";

import { Radius, Shadow, Spacing, Typography, useTheme } from "@/shared/theme";
import { Avatar } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { IconButton } from "@/shared/ui/icon-button";

import type { Professor } from "../types";

type ProfessorRowProps = {
  professor: Professor;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

// Avatar, nome e email de um professor na listagem,
// com os atalhos de editar (lápis) e excluir (lixeira).
export function ProfessorRow({ professor, isDeleting, onEdit, onDelete }: ProfessorRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        Shadow.card,
        { backgroundColor: theme.card, borderColor: theme.border, opacity: isDeleting ? 0.5 : 1 },
      ]}
    >
      <Avatar name={professor.nome} />
      <View style={styles.info}>
        <Text style={[Typography.bodyStrong, { color: theme.text }]} numberOfLines={1}>
          {professor.nome}
        </Text>
        <Text style={[Typography.caption, { color: theme.textSecondary }]} numberOfLines={1}>
          {professor.email}
        </Text>
        <Badge label="Professor" />
      </View>
      <View style={styles.actions}>
        <IconButton
          icon={{ ios: "pencil", android: "edit", web: "edit" }}
          label={`Editar ${professor.nome}`}
          onPress={onEdit}
          disabled={isDeleting}
        />
        <IconButton
          icon={{ ios: "trash", android: "delete", web: "delete" }}
          label={`Excluir ${professor.nome}`}
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
