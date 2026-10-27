import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Post } from "@/modules/posts";
import { Spacing, useTheme } from "@/shared/theme";

type AdminPostRowProps = {
  post: Post;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

// Título do post com os atalhos de editar (lápis) e excluir (lixeira).
export function AdminPostRow({ post, isDeleting, onEdit, onDelete }: AdminPostRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.card, borderColor: theme.border, opacity: isDeleting ? 0.5 : 1 },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
        {post.titulo}
      </Text>
      <View style={styles.actions}>
        <Pressable
          onPress={onEdit}
          disabled={isDeleting}
          accessibilityRole="button"
          accessibilityLabel={`Editar ${post.titulo}`}
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
          accessibilityLabel={`Excluir ${post.titulo}`}
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
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: Spacing.two,
  },
});
