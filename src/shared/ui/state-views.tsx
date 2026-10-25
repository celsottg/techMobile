import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Spacing, useTheme } from "@/shared/theme";

export function Loading({ message = "Carregando..." }: { message?: string }) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
    </View>
  );
}

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.danger }]}>Algo deu errado</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
      )}
    </View>
  );
}

type EmptyStateProps = {
  title: string;
  message?: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {message && (
        <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    padding: Spacing.four,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
