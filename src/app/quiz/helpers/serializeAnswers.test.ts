import { serializeAnswers } from "./serializeAnswers";

describe("serializeAnswers", () => {
  it("returns empty string for empty array", () => {
    expect(serializeAnswers([])).toBe("");
  });

  it("serializes single question with single answer", () => {
    expect(serializeAnswers([["A"]])).toBe("A");
  });

  it("serializes single question with multiple answers (pipe-separated)", () => {
    expect(serializeAnswers([["A", "B", "C"]])).toBe("A|B|C");
  });

  it("serializes multiple questions (comma-separated)", () => {
    expect(serializeAnswers([["A"], ["B"], ["A", "B", "C"]])).toBe("A,B,A|B|C");
  });

  it("round-trips with parseAnswersString format", () => {
    const input = [["Z"], ["Y"], ["X", "W"]];
    const serialized = serializeAnswers(input);
    expect(serialized).toBe("Z,Y,X|W");
  });

  it("handles single question with no answers (empty inner array)", () => {
    expect(serializeAnswers([[]])).toBe("");
  });

  it("handles mix of single and multiple answers", () => {
    expect(serializeAnswers([["A"], ["B", "C"], ["D"]])).toBe("A,B|C,D");
  });

  it("preserves order of questions and answers", () => {
    expect(serializeAnswers([["1"], ["2", "3"], ["4"]])).toBe("1,2|3,4");
  });
});
