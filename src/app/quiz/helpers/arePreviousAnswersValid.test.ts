import { arePreviousAnswersValid } from "./arePreviousAnswersValid";

type Question = {
  id: number;
  type?: "single" | "multiple";
  text: string;
  answers: Array<{ id: string; text: string; correct: boolean }>;
};

const singleQuestion: Question = {
  id: 1,
  type: "single",
  text: "Capital of France?",
  answers: [
    { id: "A", text: "Berlin", correct: false },
    { id: "B", text: "Paris", correct: true },
    { id: "C", text: "Madrid", correct: false },
  ],
};

const multipleQuestion: Question = {
  id: 2,
  type: "multiple",
  text: "Primary colors of light?",
  answers: [
    { id: "A", text: "Red", correct: true },
    { id: "B", text: "Green", correct: true },
    { id: "C", text: "Blue", correct: true },
    { id: "D", text: "Yellow", correct: false },
  ],
};

const singleDefaultType: Question = {
  id: 3,
  text: "No type (defaults to single)",
  answers: [
    { id: "X", text: "Wrong", correct: false },
    { id: "Y", text: "Right", correct: true },
  ],
};

describe("arePreviousAnswersValid", () => {
  it("returns true for empty answers (no previous answers)", () => {
    expect(arePreviousAnswersValid([], [singleQuestion])).toBe(true);
  });

  it("returns true when single-choice answer is correct", () => {
    expect(arePreviousAnswersValid([["B"]], [singleQuestion])).toBe(true);
  });

  it("returns false when single-choice answer is wrong", () => {
    expect(arePreviousAnswersValid([["A"]], [singleQuestion])).toBe(false);
    expect(arePreviousAnswersValid([["C"]], [singleQuestion])).toBe(false);
  });

  it("returns false when single-choice has multiple ids", () => {
    expect(arePreviousAnswersValid([["A", "B"]], [singleQuestion])).toBe(false);
  });

  it("returns false when single-choice has no answer (empty array)", () => {
    expect(arePreviousAnswersValid([[]], [singleQuestion])).toBe(false);
  });

  it("returns true when multiple-choice answers are exactly correct", () => {
    expect(
      arePreviousAnswersValid([["A", "B", "C"]], [multipleQuestion])
    ).toBe(true);
    expect(
      arePreviousAnswersValid([["C", "A", "B"]], [multipleQuestion])
    ).toBe(true);
  });

  it("returns false when multiple-choice is missing a correct answer", () => {
    expect(arePreviousAnswersValid([["A", "B"]], [multipleQuestion])).toBe(
      false
    );
  });

  it("returns false when multiple-choice has an extra wrong answer", () => {
    expect(
      arePreviousAnswersValid([["A", "B", "C", "D"]], [multipleQuestion])
    ).toBe(false);
  });

  it("returns false when multiple-choice has wrong ids", () => {
    expect(arePreviousAnswersValid([["D"]], [multipleQuestion])).toBe(false);
  });

  it("defaults to single when question type is undefined", () => {
    expect(arePreviousAnswersValid([["Y"]], [singleDefaultType])).toBe(true);
    expect(arePreviousAnswersValid([["X"]], [singleDefaultType])).toBe(false);
  });

  it("returns false when there are more answers than questions", () => {
    expect(
      arePreviousAnswersValid([["B"], ["A"]], [singleQuestion])
    ).toBe(false);
  });

  it("returns false when question is missing for an answer index", () => {
    const questions: Question[] = [singleQuestion];
    expect(arePreviousAnswersValid([["B"], ["A"]], questions)).toBe(false);
  });

  it("returns true when multiple questions all have correct answers", () => {
    const questions: Question[] = [singleQuestion, multipleQuestion];
    expect(
      arePreviousAnswersValid([["B"], ["A", "B", "C"]], questions)
    ).toBe(true);
  });

  it("returns false when one of several previous answers is wrong", () => {
    const questions: Question[] = [singleQuestion, multipleQuestion];
    expect(
      arePreviousAnswersValid([["A"], ["A", "B", "C"]], questions)
    ).toBe(false);
    expect(
      arePreviousAnswersValid([["B"], ["A", "B"]], questions)
    ).toBe(false);
  });
});
