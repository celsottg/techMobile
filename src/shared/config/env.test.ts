function loadApiUrl(hostUri: string | undefined) {
  let apiUrl = "";
  jest.isolateModules(() => {
    jest.doMock("expo-constants", () => ({
      __esModule: true,
      default: { expoConfig: hostUri ? { hostUri } : {} },
    }));
    apiUrl = jest.requireActual("./env").API_URL;
  });
  return apiUrl;
}

describe("API_URL", () => {
  const original = process.env.EXPO_PUBLIC_API_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.EXPO_PUBLIC_API_URL;
    else process.env.EXPO_PUBLIC_API_URL = original;
  });

  it("prefere EXPO_PUBLIC_API_URL quando definida", () => {
    process.env.EXPO_PUBLIC_API_URL = "http://api.exemplo.com";

    expect(loadApiUrl("192.168.0.10:8081")).toBe("http://api.exemplo.com");
  });

  it("usa o host do Metro na porta 3000", () => {
    delete process.env.EXPO_PUBLIC_API_URL;

    expect(loadApiUrl("192.168.0.10:8081")).toBe("http://192.168.0.10:3000");
  });

  it("cai para localhost sem hostUri", () => {
    delete process.env.EXPO_PUBLIC_API_URL;

    expect(loadApiUrl(undefined)).toBe("http://localhost:3000");
  });
});
