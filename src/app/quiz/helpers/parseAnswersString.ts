import { TOTAL_QUESTIONS } from "../consts";

/** Parse "A,B,A|B|C" → list of answer arrays; position = question index (0-based). */
export function parseAnswersString(value: string | null): string[][] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((segment) =>
      segment
        .trim()
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
    )
    .filter((ids) => ids.length > 0)
    .slice(0, TOTAL_QUESTIONS);
}
