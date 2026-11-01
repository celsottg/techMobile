import { DefaultTheme } from "expo-router";
import type { TextStyle, ViewStyle } from "react-native";

// Paleta oficial do app (ver "Cores" no CLAUDE.md). Não use hex soltos nas telas:
// consuma sempre estes tokens via useTheme().
export const Colors = {
  primary: "#1E3A5F", // azul institucional: botões, links, cabeçalhos e aba ativa
  primaryDark: "#152A45", // topo do login e botão pressionado
  onPrimary: "#FFFFFF", // texto e ícones sobre fundo primary
  primarySoft: "#E6EDF5", // etiquetas, fundo de ícones e avatares
  accent: "#C9932E", // dourado: destaques discretos (faixa do card, badge "Atualizado")
  accentSoft: "#FAF1E1", // fundo de etiquetas de destaque
  accentDark: "#8A5A12", // texto sobre accentSoft (accent puro não tem contraste suficiente)
  background: "#F5F6F8", // fundo das telas
  card: "#FFFFFF", // cartões, campos e busca
  text: "#1B2430", // títulos e texto principal
  textSecondary: "#5B6675", // texto secundário, placeholders e metadados
  border: "#DDE2E8", // bordas e divisores
  danger: "#C2362F", // erros e exclusão
  dangerSoft: "#FBECEB", // fundo de caixas de erro e do botão de excluir
  shadow: "rgba(16, 32, 56, 0.08)", // sombra dos cartões
} as const;

export type Theme = typeof Colors;

// Tema do React Navigation, para cabeçalhos e fundo do Stack usarem a mesma paleta.
export const NavigationTheme: ReactNavigation.Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.card,
    text: Colors.text,
    border: Colors.border,
  },
};

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

// Sombra leve de cartão. boxShadow funciona em iOS, Android e web na New Architecture.
export const Shadow = {
  card: { boxShadow: `0 1px 3px ${Colors.shadow}, 0 4px 12px ${Colors.shadow}` },
} as const satisfies Record<string, ViewStyle>;

// Escala tipográfica com a fonte do sistema. Use estes estilos em vez de fontSize/fontWeight soltos.
export const Typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: "700" },
  title: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: "600" },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: "600" },
  reading: { fontSize: 17, lineHeight: 28, fontWeight: "400" },
  label: { fontSize: 14, lineHeight: 20, fontWeight: "600" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  captionStrong: { fontSize: 13, lineHeight: 18, fontWeight: "600" },
  overline: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
} as const satisfies Record<string, TextStyle>;

export function useTheme(): Theme {
  return Colors;
}
