import {
  getProfessoresVersion,
  notifyProfessoresChanged,
  subscribeProfessoresChanges,
} from "./professores-changes";

it("incrementa a versão e avisa quem está inscrito até cancelar a inscrição", () => {
  const listener = jest.fn();
  const unsubscribe = subscribeProfessoresChanges(listener);
  const before = getProfessoresVersion();

  notifyProfessoresChanged();
  expect(getProfessoresVersion()).toBe(before + 1);
  expect(listener).toHaveBeenCalledTimes(1);

  unsubscribe();
  notifyProfessoresChanged();
  expect(listener).toHaveBeenCalledTimes(1);
});
