import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";

import { useSession } from "@/shared/session";
import { Typography, useTheme } from "@/shared/theme";

// Área autenticada do app (pós-login). O grupo (app) não aparece na URL.
// Cada aba tem o próprio Stack; a aba Admin só existe para professores.
export default function AppLayout() {
  const theme = useTheme();
  const { session } = useSession();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: Typography.captionStrong,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
      }}
    >
      <Tabs.Screen
        name="(posts)"
        options={{
          title: "Blog",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: "book", android: "menu_book", web: "menu_book" }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Protected guard={session?.role === "PROFESSOR"}>
        <Tabs.Screen
          name="admin"
          options={{
            title: "Gestão",
            tabBarIcon: ({ color, size }) => (
              <SymbolView
                name={{
                  ios: "gearshape",
                  android: "admin_panel_settings",
                  web: "admin_panel_settings",
                }}
                tintColor={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
