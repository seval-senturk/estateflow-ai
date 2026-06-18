"use client";

import { useCallback, useState } from "react";

import type { ActionResult } from "@/types";

type AiActionState<T> = {
  data: T | null;
  error: string | null;
  isLoading: boolean;
};

export function useAiAction<TInput, TOutput>(
  action: (input: TInput) => Promise<ActionResult<TOutput>>,
) {
  const [state, setState] = useState<AiActionState<TOutput>>({
    data: null,
    error: null,
    isLoading: false,
  });
  const [lastInput, setLastInput] = useState<TInput | null>(null);

  const execute = useCallback(
    async (input: TInput) => {
      setLastInput(input);
      setState({ data: null, error: null, isLoading: true });

      const result = await action(input);

      if (result.success) {
        setState({ data: result.data, error: null, isLoading: false });
        return result;
      }

      setState({ data: null, error: result.error ?? "AI isteği başarısız oldu.", isLoading: false });
      return result;
    },
    [action],
  );

  const retry = useCallback(async () => {
    if (!lastInput) return;
    await execute(lastInput);
  }, [execute, lastInput]);

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
    setLastInput(null);
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
    canRetry: Boolean(lastInput),
  };
}
