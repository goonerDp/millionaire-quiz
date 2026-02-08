"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import gameConfig from "@/data/game-config.json";
import { parseAnswersString, serializeAnswers } from "./helpers";
import { TOTAL_QUESTIONS } from "./consts";
import AnswerPicker, {
  type AnswerPickerVariant,
} from "./components/AnswerPicker";
import { Popup, PriceLadder } from "./components";
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
  const [ladderOpen, setLadderOpen] = useState(false);

  const answersByQuestion = parseAnswersString(answersParam);
  const activeIndex = answersByQuestion.length;

  const questions = gameConfig.questions as Question[];
  const prizes = gameConfig.prizes as number[];

  if (activeIndex >= TOTAL_QUESTIONS) {
    router.replace(`/result?earned=${prizes[TOTAL_QUESTIONS - 1]}`);
    return <p>Redirecting...</p>;
  }

  const question = questions[activeIndex];

  function commitAnswer(answerIds: string[]) {
    if (activeIndex + 1 >= TOTAL_QUESTIONS) {
      router.push(`/result?earned=${prizes[TOTAL_QUESTIONS - 1]}`);
      return;
    }
    const nextAnswers = [...answersByQuestion, answerIds];
    setAnswersParam(serializeAnswers(nextAnswers));
  }

  function handleWrong() {
    const amount = activeIndex === 0 ? 0 : prizes[activeIndex - 1];
    router.push(`/result?earned=${amount}`);
  }

  const questionType = question.type ?? "single";

  function isMultipleChoiceCorrect(ids: string[]): boolean {
    const correctIds = new Set(
      question.answers.filter((a) => a.correct).map((a) => a.id)
    );
    const selectedSet = new Set(ids);
    return (
      correctIds.size === selectedSet.size &&
      [...selectedSet].every((id) => correctIds.has(id))
    );
  }

  function handleSingleChange(answerId: string) {
    const selected = question.answers.find((a) => a.id === answerId);
    if (!selected) return;
    if (!selected.correct) {
      handleWrong();
      return;
    }
    commitAnswer([answerId]);
  }

  function handleMultipleChange(answerId: string) {
    setSelectedIds((prev) =>
      prev.includes(answerId)
        ? prev.filter((id) => id !== answerId)
        : [...prev, answerId]
    );
  }

  function handleMultipleSubmit() {
    if (!selectedIds.length) return;
    if (!isMultipleChoiceCorrect(selectedIds)) {
      handleWrong();
      return;
    }
    commitAnswer(selectedIds);
  }

  function getAnswerPickerVariant(a: {
    id: string;
  }): AnswerPickerVariant | undefined {
    return selectedIds.includes(a.id) ? "selected" : undefined;
  }

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.wrapperStart}>
          <div className={styles.container}>
            <header className={styles.header}>
              <button
                type="button"
                className={styles.burgerButton}
                onClick={() => setLadderOpen(true)}
                aria-label="Open prize ladder"
              >
                <span className={styles.burgerLine} />
                <span className={styles.burgerLine} />
                <span className={styles.burgerLine} />
              </button>
            </header>
            <h2 className={styles.title}>{question.text}</h2>
            <ul className={styles.answersList}>
              {question.answers.map((a) => (
                <li key={a.id}>
                  <AnswerPicker
                    id={a.id}
                    text={a.text}
                    variant={getAnswerPickerVariant(a)}
                    onChange={
                      questionType === "single"
                        ? handleSingleChange
                        : handleMultipleChange
                    }
                  />
                </li>
              ))}
            </ul>
            {/* TODO: style confirm button */}
            {questionType === "multiple" && (
              <button
                type="button"
                className={styles.confirmButton}
                onClick={handleMultipleSubmit}
                disabled={selectedIds.length === 0}
              >
                Confirm
              </button>
            )}
          </div>
        </div>
        <div className={styles.wrapperEnd}>
          <PriceLadder prizes={prizes} activeIndex={activeIndex} />
        </div>
      </div>
      <Popup
        open={ladderOpen}
        onClose={() => setLadderOpen(false)}
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
