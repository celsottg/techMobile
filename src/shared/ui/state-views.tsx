import { SymbolView } from "expo-symbols";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Radius, Spacing, Typography, useTheme } from "@/shared/theme";

import { Button } from "./button";
import type { IconName } from "./icon-button";

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
      <View style={[styles.iconCircle, { backgroundColor: theme.dangerSoft }]}>
        <SymbolView
          name={{ ios: "exclamationmark.triangle", android: "warning", web: "warning" }}
          tintColor={theme.danger}
          size={28}
        />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>Algo deu errado</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
      {onRetry && (
        <View style={styles.action}>
          <Button title="Tentar novamente" onPress={onRetry} />
        </View>
      )}
    </View>
  );
}

type EmptyStateProps = {
  title: string;
  message?: string;
  icon?: IconName;
};

const DEFAULT_EMPTY_ICON: IconName = { ios: "tray", android: "inbox", web: "inbox" };

export function EmptyState({ title, message, icon = DEFAULT_EMPTY_ICON }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: theme.primarySoft }]}>
        <SymbolView name={icon} tintColor={theme.primary} size={28} />
      </View>
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
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  title: {
    ...Typography.heading,
    textAlign: "center",
  },
  message: {
    ...Typography.body,
    textAlign: "center",
  },
  action: {
    marginTop: Spacing.two,
  },
});
