// Dublê do expo-router para testes de tela. Uso:
//   jest.mock("expo-router", () => require("@/test/expo-router-mock").expoRouterMock);
export const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  navigate: jest.fn(),
  dismissTo: jest.fn(),
  canGoBack: jest.fn(() => true),
};

// Parâmetros de rota devolvidos por useLocalSearchParams (ex.: { id: "1" }).
export const mockParams: Record<string, string> = {};

export const expoRouterMock = {
  // O tema do app espalha DefaultTheme.colors, então o dublê precisa dele.
  DefaultTheme: { colors: {} },
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
};
