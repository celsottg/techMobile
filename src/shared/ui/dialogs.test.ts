import { Alert, Platform } from "react-native";

import { confirmDestructive, showMessage } from "./dialogs";

const options = { title: "Excluir post", message: "Tem certeza?", confirmLabel: "Excluir" };

afterEach(() => {
  jest.restoreAllMocks();
  Reflect.deleteProperty(globalThis, "window");
});

describe("dialogs (nativo)", () => {
  function pressButton(label: string) {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
    return {
      alertSpy,
      press: () => {
        const buttons = alertSpy.mock.calls[0][2] ?? [];
        buttons.find((button) => button.text === label)?.onPress?.();
      },
    };
  }

  it("resolve true ao confirmar", async () => {
    const { press } = pressButton("Excluir");
    const result = confirmDestructive(options);

    press();

    await expect(result).resolves.toBe(true);
  });

  it("resolve false ao cancelar", async () => {
    const { press } = pressButton("Cancelar");
    const result = confirmDestructive(options);

    press();

    await expect(result).resolves.toBe(false);
  });

  it("resolve false ao dispensar o alerta", async () => {
    const { alertSpy } = pressButton("Cancelar");
    const result = confirmDestructive(options);

    alertSpy.mock.calls[0][3]?.onDismiss?.();

    await expect(result).resolves.toBe(false);
  });

  it("showMessage usa Alert.alert", () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);

    showMessage("Erro", "Algo deu errado");

    expect(alertSpy).toHaveBeenCalledWith("Erro", "Algo deu errado");
  });
});

describe("dialogs (web)", () => {
  const windowMock = { confirm: jest.fn(), alert: jest.fn() };

  beforeEach(() => {
    jest.replaceProperty(Platform, "OS", "web");
    Object.defineProperty(globalThis, "window", { configurable: true, value: windowMock });
  });

  it("confirmDestructive usa window.confirm", async () => {
    windowMock.confirm.mockReturnValue(true);

    await expect(confirmDestructive(options)).resolves.toBe(true);

    expect(windowMock.confirm).toHaveBeenCalledWith("Excluir post\n\nTem certeza?");
  });

  it("showMessage usa window.alert", () => {
    showMessage("Erro", "Algo deu errado");

    expect(windowMock.alert).toHaveBeenCalledWith("Erro\n\nAlgo deu errado");
  });
});
