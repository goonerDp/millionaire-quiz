/** Serialize list of answer arrays to "A,B,A|B|C". */
export function serializeAnswers(answersByQuestion: string[][]): string {
  return answersByQuestion.map((ids) => ids.join("|")).join(",");
}
