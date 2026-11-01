import { StyleSheet, Text, View } from "react-native";

import { formatDate, type Post } from "@/modules/posts";
import { Radius, Shadow, Spacing, Typography, useTheme } from "@/shared/theme";
import { IconButton } from "@/shared/ui/icon-button";

type AdminPostRowProps = {
  post: Post;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

// Título e data do post com os atalhos de editar (lápis) e excluir (lixeira).
export function AdminPostRow({ post, isDeleting, onEdit, onDelete }: AdminPostRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        Shadow.card,
        { backgroundColor: theme.card, borderColor: theme.border, opacity: isDeleting ? 0.5 : 1 },
      ]}
    >
      <View style={styles.info}>
        <Text style={[Typography.bodyStrong, { color: theme.text }]} numberOfLines={2}>
          {post.titulo}
        </Text>
        <Text style={[Typography.caption, { color: theme.textSecondary }]}>
          Publicado em {formatDate(post.data_publicacao)}
        </Text>
      </View>
      <View style={styles.actions}>
        <IconButton
          icon={{ ios: "pencil", android: "edit", web: "edit" }}
          label={`Editar ${post.titulo}`}
          onPress={onEdit}
          disabled={isDeleting}
        />
        <IconButton
          icon={{ ios: "trash", android: "delete", web: "delete" }}
          label={`Excluir ${post.titulo}`}
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
