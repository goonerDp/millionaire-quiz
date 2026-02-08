"use client";

import { useState, useEffect, useRef } from "react";

const DEFAULT_PENDING_MS = 500;
const DEFAULT_REVEALED_MS = 1000;

export type AnsweredSelection =
  | {
      phase: "pending";
      answerIds: string[];
      correct: boolean;
      correctAnswerIds: string[];
    }
  | {
      phase: "revealed";
      answerIds: string[];
      correct: boolean;
      correctAnswerIds: string[];
    };

type Options = {
  pendingDelayMs?: number;
  revealedDelayMs?: number;
  onCorrect: (answerIds: string[]) => void;
  onWrong: () => void;
};

export function useAnswerTransition({
  pendingDelayMs = DEFAULT_PENDING_MS,
  revealedDelayMs = DEFAULT_REVEALED_MS,
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

    if (answeredSelection.phase === "pending") {
      const timer = setTimeout(() => {
        setAnsweredSelection({
          phase: "revealed",
          answerIds: answeredSelection.answerIds,
          correct: answeredSelection.correct,
          correctAnswerIds: answeredSelection.correctAnswerIds,
        });
      }, pendingDelayMs);
      return () => clearTimeout(timer);
    }

    // phase === "revealed"
    const timer = setTimeout(() => {
      if (answeredSelection.correct) {
        onCorrectRef.current(answeredSelection.answerIds);
      } else {
        onWrongRef.current();
      }
      setAnsweredSelection(null);
    }, revealedDelayMs);
    return () => clearTimeout(timer);
  }, [answeredSelection, pendingDelayMs, revealedDelayMs]);

  function selectAnswer(
    answerId: string,
    correct: boolean,
    correctAnswerIds: string[]
  ) {
    setAnsweredSelection((prev) =>
      prev
        ? prev
        : {
            phase: "pending",
            answerIds: [answerId],
            correct,
            correctAnswerIds,
          }
    );
  }

  function selectAnswers(
    answerIds: string[],
    correct: boolean,
    correctAnswerIds: string[]
  ) {
    setAnsweredSelection((prev) =>
      prev
        ? prev
        : {
            phase: "pending",
            answerIds,
            correct,
            correctAnswerIds,
          }
    );
  }

  return {
    answeredSelection,
    selectAnswer,
    selectAnswers,
    isTransitioning: answeredSelection !== null,
  };
}
