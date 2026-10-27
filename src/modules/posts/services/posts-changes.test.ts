import { getPostsVersion, notifyPostsChanged, subscribePostsChanges } from "./posts-changes";

describe("posts-changes", () => {
  it("incrementa a versão e avisa os assinantes", () => {
    const listener = jest.fn();
    const unsubscribe = subscribePostsChanges(listener);
    const before = getPostsVersion();

    notifyPostsChanged();

    expect(getPostsVersion()).toBe(before + 1);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("não avisa quem cancelou a assinatura", () => {
    const listener = jest.fn();
    subscribePostsChanges(listener)();

    notifyPostsChanged();

    expect(listener).not.toHaveBeenCalled();
  });
});
