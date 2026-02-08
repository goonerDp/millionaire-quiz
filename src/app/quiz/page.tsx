"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import gameConfig from "@/data/game-config.json";
import {
  arePreviousAnswersValid,
  getIsMultipleChoiceCorrect,
  parseAnswersString,
  serializeAnswers,
} from "./helpers";
import { TOTAL_QUESTIONS } from "./consts";
import AnswerPicker, {
  type AnswerPickerVariant,
} from "./components/AnswerPicker";
import { useAnswerTransition } from "./hooks/useAnswerTransition";
import { BurgerButton, Popup, PriceLadder } from "./components";
import Button from "@/components/Button";
import styles from "./page.module.scss";

type Question = {
  id: number;
  type?: "single" | "multiple";
  text: string;
  answers: Array<{ id: string; text: string; correct: boolean }>;
};

function QuizContent() {
  const router = useRouter();
  const [answersParam, setAnswersParam] = useQueryState(
    "answers",
    parseAsString.withDefault("")
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const answersByQuestion = parseAnswersString(answersParam);
  const activeIndex = answersByQuestion.length;

  const questions = gameConfig.questions as Question[];
  const prizes = gameConfig.prizes as number[];

  const previousAnswersValid =
    answersByQuestion.length === 0 ||
    arePreviousAnswersValid(answersByQuestion, questions);

  useEffect(() => {
    if (!previousAnswersValid) {
      router.replace("/quiz");
    }
  }, [previousAnswersValid, router]);

  function commitAnswer(answerIds: string[]) {
    const nextAnswers = [...answersByQuestion, answerIds];

    setSelectedIds([]);

    if (activeIndex + 1 >= TOTAL_QUESTIONS) {
      router.push(`/result?earned=${prizes[TOTAL_QUESTIONS - 1]}`);
      return;
    }

    setAnswersParam(serializeAnswers(nextAnswers));
  }

  function handleWrong() {
    const amount = activeIndex === 0 ? 0 : prizes[activeIndex - 1];

    router.push(`/result?earned=${amount}`);
  }

  const { answeredSelection, selectAnswer, selectAnswers, isTransitioning } =
    useAnswerTransition({
      pendingDelayMs: 500,
      revealedDelayMs: 1000,
      onCorrect: commitAnswer,
      onWrong: handleWrong,
    });

  if (!previousAnswersValid || activeIndex >= TOTAL_QUESTIONS) {
    if (activeIndex >= TOTAL_QUESTIONS) {
      router.replace(`/result?earned=${prizes[TOTAL_QUESTIONS - 1]}`);
    }
    return null;
  }

  const question = questions[activeIndex];
  const questionType = question.type ?? "single";
  const correctAnswerIds = question.answers
    .filter((answer) => answer.correct)
    .map((answer) => answer.id);

  function handleSingleChange(answerId: string) {
    const selected = question.answers.find((answer) => answer.id === answerId);

    if (!selected || isTransitioning) {
      return;
    }
    selectAnswer(answerId, selected.correct, correctAnswerIds);
  }

  function handleMultipleChange(answerId: string) {
    if (isTransitioning) {
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(answerId)
        ? prev.filter((id) => id !== answerId)
        : [...prev, answerId]
    );
  }

  function handleMultipleSubmit() {
    if (!selectedIds.length || isTransitioning) {
      return;
    }

    selectAnswers(
      selectedIds,
      getIsMultipleChoiceCorrect(selectedIds, correctAnswerIds),
      correctAnswerIds
    );
  }

  function getAnswerPickerVariant(answer: {
    id: string;
  }): AnswerPickerVariant | undefined {
    if (!answeredSelection) {
      return questionType === "multiple" && selectedIds.includes(answer.id)
        ? "selected"
        : undefined;
    }
    if (answeredSelection.phase === "pending") {
      return answeredSelection.answerIds.includes(answer.id)
        ? "selected"
        : undefined;
    }
    // revealed: show all correct answers in green, wrong selections in red
    if (answeredSelection.correctAnswerIds.includes(answer.id)) {
      return "correct";
    }
    if (answeredSelection.answerIds.includes(answer.id)) {
      return "wrong";
    }
    return undefined;
  }

  function getAnswerPickerPulsate(answer: { id: string }): boolean {
    if (!answeredSelection || answeredSelection.phase !== "pending") {
      return false;
    }
    return answeredSelection.answerIds.includes(answer.id);
  }

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.wrapperStart}>
          <div className={styles.container}>
            <header className={styles.header}>
              <BurgerButton onClick={() => setIsPopupOpen(true)} />
            </header>
            <h2 className={styles.title}>{question.text}</h2>
            <ul className={styles.answersList}>
              {question.answers.map((answer) => (
                <li key={answer.id}>
                  <AnswerPicker
                    id={answer.id}
                    text={answer.text}
                    variant={getAnswerPickerVariant(answer)}
                    pulsate={getAnswerPickerPulsate(answer)}
                    disabled={isTransitioning}
                    onChange={
                      questionType === "single"
                        ? handleSingleChange
                        : handleMultipleChange
                    }
                  />
                </li>
              ))}
            </ul>
            {questionType === "multiple" && (
              <Button
                type="button"
                className={styles.confirmButton}
                onClick={handleMultipleSubmit}
                disabled={selectedIds.length === 0 || isTransitioning}
              >
                Confirm
              </Button>
            )}
          </div>
        </div>
        <div className={styles.wrapperEnd}>
          <PriceLadder prizes={prizes} activeIndex={activeIndex} />
        </div>
      </div>
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="Prize ladder"
      >
        <PriceLadder prizes={prizes} activeIndex={activeIndex} />
      </Popup>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <QuizContent />
    </Suspense>
  );
}
