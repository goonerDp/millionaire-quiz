import { getIsMultipleChoiceCorrect } from "./getIsMultipleChoiceCorrect";

type Question = {
  id: number;
  type?: "single" | "multiple";
  text: string;
  answers: Array<{ id: string; text: string; correct: boolean }>;
};

/**
 * Returns true if every answer in answersByQuestion matches the correct
 * answer(s) for the corresponding question. Used to detect tampered URL state.
 */
export function arePreviousAnswersValid(
  answersByQuestion: string[][],
  questions: Question[]
): boolean {
  if (answersByQuestion.length === 0) return true;

  for (let i = 0; i < answersByQuestion.length; i++) {
    const question = questions[i];
    if (!question) return false;

    const answerIds = answersByQuestion[i];
    const correctAnswerIds = question.answers
      .filter((a) => a.correct)
      .map((a) => a.id);

    const type = question.type ?? "single";
    if (type === "single") {
      if (answerIds.length !== 1 || answerIds[0] !== correctAnswerIds[0]) {
        return false;
      }
    } else {
      if (!getIsMultipleChoiceCorrect(answerIds, correctAnswerIds)) {
        return false;
      }
    }
  }
  return true;
}
