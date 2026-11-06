import { describe, expect, it } from "vitest";
import { codeSamples } from "@/content/code-samples";
import { caretPosition, sliceTokens, tokenize } from "@/lib/code-tokenizer";

describe("tokenize", () => {
  it("gives back every sample exactly when its tokens are joined", () => {
    for (const sample of codeSamples) {
      const tokens = tokenize(sample.code, sample.language);
      expect(tokens.map(([, text]) => text).join("")).toBe(sample.code);
    }
  });

  it("colours keywords, strings, comments, decorators, numbers, and calls in Python", () => {
    const tokens = tokenize(
      '# note\n@agent.on("message")\nasync def reply(msg):\n    return 30',
      "py",
    );
    const kinds = new Map(tokens.map(([kind, text]) => [text, kind]));
    expect(kinds.get("# note")).toBe("cm");
    expect(kinds.get("@agent.on")).toBe("dec");
    expect(kinds.get('"message"')).toBe("str");
    expect(kinds.get("async")).toBe("kw");
    expect(kinds.get("reply")).toBe("fn");
    expect(kinds.get("return")).toBe("kw");
    expect(kinds.get("30")).toBe("num");
  });

  it("marks capitalised names as types and other names as identifiers", () => {
    const tokens = tokenize("const app = MaterialApp;", "ts");
    expect(tokens).toContainEqual(["type", "MaterialApp"]);
    expect(tokens).toContainEqual(["id", "app"]);
  });

  it("matches SQL keywords in any case and uses -- comments", () => {
    const tokens = tokenize("-- table\nCREATE table bookings", "sql");
    expect(tokens[0]).toEqual(["cm", "-- table"]);
    expect(tokens).toContainEqual(["kw", "CREATE"]);
    expect(tokens).toContainEqual(["kw", "table"]);
  });

  it("does not treat a # as a comment outside Python", () => {
    expect(tokenize("a # b", "ts").some(([kind]) => kind === "cm")).toBe(false);
  });
});

describe("sliceTokens", () => {
  it("keeps the first characters, cutting the last token", () => {
    const tokens = tokenize("const answer = 42;", "ts");
    const sliced = sliceTokens(tokens, 9);
    expect(sliced.map(([, text]) => text).join("")).toBe("const ans");
    expect(sliced.at(-1)).toEqual(["id", "ans"]);
  });

  it("returns nothing for zero and everything past the end", () => {
    const tokens = tokenize("x = 1", "py");
    expect(sliceTokens(tokens, 0)).toEqual([]);
    expect(
      sliceTokens(tokens, 99)
        .map(([, text]) => text)
        .join(""),
    ).toBe("x = 1");
  });
});

describe("caretPosition", () => {
  it("counts lines and columns from one, like an editor", () => {
    const code = "ab\ncde\nf";
    expect(caretPosition(code, 0)).toEqual({ line: 1, column: 1 });
    expect(caretPosition(code, 2)).toEqual({ line: 1, column: 3 });
    expect(caretPosition(code, 3)).toEqual({ line: 2, column: 1 });
    expect(caretPosition(code, code.length)).toEqual({ line: 3, column: 2 });
  });
});
