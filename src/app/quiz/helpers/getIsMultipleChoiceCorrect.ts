export function getIsMultipleChoiceCorrect(
  ids: string[],
  correctAnswerIds: string[]
): boolean {
  const correctIds = new Set(correctAnswerIds);
  const selectedSet = new Set(ids);
  return (
    correctIds.size === selectedSet.size &&
    [...selectedSet].every((id) => correctIds.has(id))
  );
}
