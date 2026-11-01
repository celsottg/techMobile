import {
  getAlunosVersion,
  notifyAlunosChanged,
  subscribeAlunosChanges,
} from "./alunos-changes";

it("incrementa a versão e avisa quem está inscrito até cancelar a inscrição", () => {
  const listener = jest.fn();
  const unsubscribe = subscribeAlunosChanges(listener);
  const before = getAlunosVersion();

  notifyAlunosChanged();
  expect(getAlunosVersion()).toBe(before + 1);
  expect(listener).toHaveBeenCalledTimes(1);

  unsubscribe();
  notifyAlunosChanged();
  expect(listener).toHaveBeenCalledTimes(1);
});
