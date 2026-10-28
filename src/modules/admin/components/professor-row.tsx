import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

import type { Professor } from "../types";

type ProfessorRowProps = {
  professor: Professor;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

// Nome e email de um professor na listagem, com os atalhos de editar (lápis) e excluir (lixeira).
export function ProfessorRow({ professor, isDeleting, onEdit, onDelete }: ProfessorRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.card, borderColor: theme.border, opacity: isDeleting ? 0.5 : 1 },
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {professor.nome}
        </Text>
        <Text style={[styles.email, { color: theme.textSecondary }]} numberOfLines={1}>
          {professor.email}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={onEdit}
          disabled={isDeleting}
          accessibilityRole="button"
          accessibilityLabel={`Editar ${professor.nome}`}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <SymbolView
            name={{ ios: "pencil", android: "edit", web: "edit" }}
            tintColor={theme.primary}
            size={22}
          />
        </Pressable>
        <Pressable
          onPress={onDelete}
          disabled={isDeleting}
          accessibilityRole="button"
          accessibilityLabel={`Excluir ${professor.nome}`}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <SymbolView
            name={{ ios: "trash", android: "delete", web: "delete" }}
            tintColor={theme.danger}
            size={22}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  email: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: Spacing.two,
  },
});
