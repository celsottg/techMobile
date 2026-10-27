import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";

import { useSession } from "@/shared/session";
import { useTheme } from "@/shared/theme";

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
      }}
    >
      <Tabs.Screen
        name="(posts)"
        options={{
          title: "Posts",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: "doc.text", android: "article", web: "article" }}
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
            title: "Admin",
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
