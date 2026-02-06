import { parseAnswersString } from "./parseAnswersString";
import { TOTAL_QUESTIONS } from "../consts";

describe("parseAnswersString", () => {
  it("returns empty array for null", () => {
    expect(parseAnswersString(null)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(parseAnswersString("")).toEqual([]);
  });

  it("returns empty array for whitespace-only string", () => {
    expect(parseAnswersString("   ")).toEqual([]);
  });

  it("parses single question with single answer", () => {
    expect(parseAnswersString("A")).toEqual([["A"]]);
  });

  it("parses single question with multiple answers (pipe-separated)", () => {
    expect(parseAnswersString("A|B|C")).toEqual([["A", "B", "C"]]);
  });

  it("parses multiple questions (comma-separated)", () => {
    expect(parseAnswersString("A,B,A|B|C")).toEqual([
      ["A"],
      ["B"],
      ["A", "B", "C"],
    ]);
  });

  it("trims whitespace around commas and pipes", () => {
    expect(parseAnswersString(" A ,  B , A | B | C ")).toEqual([
      ["A"],
      ["B"],
      ["A", "B", "C"],
    ]);
  });

  it("filters out empty segments (consecutive commas)", () => {
    expect(parseAnswersString("A,,B")).toEqual([["A"], ["B"]]);
  });

  it("filters out segments that become empty after trimming pipes", () => {
    expect(parseAnswersString("A||B")).toEqual([["A", "B"]]);
  });

  it("returns empty array when all segments are empty or whitespace", () => {
    expect(parseAnswersString(",,  ,||")).toEqual([]);
  });

  it("caps result at TOTAL_QUESTIONS questions", () => {
    const many = Array.from(
      { length: TOTAL_QUESTIONS + 5 },
      (_, i) => "X"
    ).join(",");
    const result = parseAnswersString(many);
    expect(result).toHaveLength(TOTAL_QUESTIONS);
    expect(result.every((q) => q.length === 1 && q[0] === "X")).toBe(true);
  });

  it("preserves order of questions and answers", () => {
    expect(parseAnswersString("Z,Y,X|W")).toEqual([["Z"], ["Y"], ["X", "W"]]);
  });
});
