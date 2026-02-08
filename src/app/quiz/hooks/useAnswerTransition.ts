"use client";

import { useState, useEffect, useRef } from "react";

const DEFAULT_DELAY_MS = 500;

export type AnsweredSelection = {
  answerIds: string[];
  correct: boolean;
};

type Options = {
  delayMs?: number;
  onCorrect: (answerIds: string[]) => void;
  onWrong: () => void;
};

export function useAnswerTransition({
  delayMs = DEFAULT_DELAY_MS,
  onCorrect,
  onWrong,
}: Options) {
  const [answeredSelection, setAnsweredSelection] =
    useState<AnsweredSelection | null>(null);
  const onCorrectRef = useRef(onCorrect);
  const onWrongRef = useRef(onWrong);

  useEffect(() => {
    onCorrectRef.current = onCorrect;
    onWrongRef.current = onWrong;
  });

  useEffect(() => {
    if (!answeredSelection) return;
    const timer = setTimeout(() => {
      if (answeredSelection.correct) {
        onCorrectRef.current(answeredSelection.answerIds);
      } else {
        onWrongRef.current();
      }
      setAnsweredSelection(null);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [answeredSelection, delayMs]);

  function selectAnswer(answerId: string, correct: boolean) {
    setAnsweredSelection((prev) =>
      prev ? prev : { answerIds: [answerId], correct }
    );
  }

  function selectAnswers(answerIds: string[], correct: boolean) {
    setAnsweredSelection((prev) =>
      prev ? prev : { answerIds, correct }
    );
  }

  return {
    answeredSelection,
    selectAnswer,
    selectAnswers,
    isTransitioning: answeredSelection !== null,
  };
}
