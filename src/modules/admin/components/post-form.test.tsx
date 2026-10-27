import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ComponentProps } from "react";

import { PostForm } from "./post-form";

async function renderForm(overrides: Partial<ComponentProps<typeof PostForm>> = {}) {
  const props: ComponentProps<typeof PostForm> = {
    titulo: "Título",
    conteudo: "Conteúdo",
    fieldErrors: {},
    formError: null,
    isSubmitting: false,
    submitTitle: "Publicar",
    submittingTitle: "Publicando...",
    onChangeField: jest.fn(),
    onSubmit: jest.fn(),
    ...overrides,
  };
  await render(<PostForm {...props} />);
  return { props };
}

describe("PostForm", () => {
  it("mostra os valores recebidos", async () => {
    await renderForm();

    expect(screen.getByLabelText("Título")).toHaveDisplayValue("Título");
    expect(screen.getByLabelText("Conteúdo")).toHaveDisplayValue("Conteúdo");
  });

  it("avisa qual campo mudou", async () => {
    const { props } = await renderForm();

    await fireEvent.changeText(screen.getByLabelText("Título"), "Outro");
    await fireEvent.changeText(screen.getByLabelText("Conteúdo"), "Outro texto");

    expect(props.onChangeField).toHaveBeenCalledWith("titulo", "Outro");
    expect(props.onChangeField).toHaveBeenCalledWith("conteudo", "Outro texto");
  });

  it("envia ao tocar no botão", async () => {
    const { props } = await renderForm({ submitTitle: "Salvar alterações" });

    await fireEvent.press(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("mostra os erros dos campos e o erro geral", async () => {
    await renderForm({
      fieldErrors: { titulo: "Informe o título.", conteudo: "Informe o conteúdo." },
      formError: "Verifique os campos e tente novamente.",
    });

    expect(screen.getByText("Informe o título.")).toBeTruthy();
    expect(screen.getByText("Informe o conteúdo.")).toBeTruthy();
    expect(screen.getByText("Verifique os campos e tente novamente.")).toBeTruthy();
  });

  it("mostra o texto de envio e bloqueia a edição enquanto envia", async () => {
    const { props } = await renderForm({ isSubmitting: true });

    await fireEvent.press(screen.getByRole("button", { name: "Publicando..." }));

    expect(props.onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Título")).toBeDisabled();
  });
});
