import { useColorScheme } from "react-native";

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#60646C",
    background: "#F7F7F9",
    card: "#FFFFFF",
    border: "#E0E1E6",
    primary: "#208AEF",
    danger: "#D93036",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#B0B4BA",
    background: "#000000",
    card: "#18191B",
    border: "#2E3135",
    primary: "#3C9EFF",
    danger: "#FF6369",
  },
} as const;

export type Theme = (typeof Colors)["light"] | (typeof Colors)["dark"];

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;

export function useTheme(): Theme {
  return useColorScheme() === "dark" ? Colors.dark : Colors.light;
}
