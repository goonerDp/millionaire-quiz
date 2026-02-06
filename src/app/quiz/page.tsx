"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import gameConfig from "@/data/game-config.json";
import { parseAnswersString, serializeAnswers } from "./helpers";
import { TOTAL_QUESTIONS } from "./consts";

function QuizContent() {
  const router = useRouter();
  const [answersParam, setAnswersParam] = useQueryState(
    "answers",
    parseAsString.withDefault("")
  );

  const answersByQuestion = parseAnswersString(answersParam);
  const activeIndex = answersByQuestion.length;

  const questions = gameConfig.questions as Array<{
    id: number;
    type?: "single" | "multiple";
    text: string;
    answers: Array<{ id: string; text: string; correct: boolean }>;
  }>;
  const prizes = gameConfig.prizes as number[];

  if (activeIndex >= TOTAL_QUESTIONS) {
    router.replace(`/result?won=${prizes[TOTAL_QUESTIONS - 1]}`);
    return <p>Redirecting...</p>;
  }

  const question = questions[activeIndex];
  const questionType = question.type ?? "single";
  const currentPrize = prizes[activeIndex];

  const correctIds = question.answers
    .filter((a) => a.correct)
    .map((a) => a.id)
    .sort();

  function commitAnswer(answerIds: string[]) {
    if (activeIndex + 1 >= TOTAL_QUESTIONS) {
      router.push(`/result?won=${prizes[TOTAL_QUESTIONS - 1]}`);
      return;
    }
    const nextAnswers = [...answersByQuestion, answerIds];
    setAnswersParam(serializeAnswers(nextAnswers));
  }

  function handleSingleSubmit(selectedAnswerId: string) {
    const selected = question.answers.find((a) => a.id === selectedAnswerId);
    if (!selected) return;
    if (!selected.correct) {
      router.push(`/result?lost=${activeIndex + 1}`);
      return;
    }
    commitAnswer([selectedAnswerId]);
  }

  if (questionType === "single") {
    return (
      <div>
        <h1>
          Question {activeIndex + 1} of {TOTAL_QUESTIONS}
        </h1>
        <p>Prize at stake: {currentPrize}</p>
        <h2>{question.text}</h2>
        <ul>
          {question.answers.map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => handleSingleSubmit(a.id)}>
                {a.id}. {a.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <MultipleChoiceQuestion
      question={question}
      activeIndex={activeIndex}
      totalQuestions={TOTAL_QUESTIONS}
      currentPrize={currentPrize}
      correctIds={correctIds}
      onWrong={() => router.push(`/result?lost=${activeIndex + 1}`)}
      onCorrect={(answerIds) => commitAnswer(answerIds)}
    />
  );
}

function MultipleChoiceQuestion({
  question,
  activeIndex,
  totalQuestions,
  currentPrize,
  correctIds,
  onWrong,
  onCorrect,
}: {
  question: {
    text: string;
    answers: Array<{ id: string; text: string; correct: boolean }>;
  };
  activeIndex: number;
  totalQuestions: number;
  currentPrize: number;
  correctIds: string[];
  onWrong: () => void;
  onCorrect: (answerIds: string[]) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.has(id)
        ? new Set([...prev].filter((x) => x !== id))
        : new Set([...prev, id])
    );
  }

  function handleSubmit() {
    const sorted = [...selectedIds].sort();
    if (sorted.join("|") !== correctIds.join("|")) {
      onWrong();
      return;
    }
    onCorrect(sorted);
  }

  return (
    <div>
      <h1>
        Question {activeIndex + 1} of {totalQuestions}
      </h1>
      <p>Prize at stake: {currentPrize}</p>
      <h2>{question.text}</h2>
      <p>Select all that apply.</p>
      <ul>
        {question.answers.map((a) => (
          <li key={a.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedIds.has(a.id)}
                onChange={() => toggle(a.id)}
              />
              {a.id}. {a.text}
            </label>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={selectedIds.size === 0}
      >
        Submit
      </button>
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
