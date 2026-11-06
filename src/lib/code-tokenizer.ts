/**
 * A small syntax tokenizer for the home page editor (CodeTypewriter): enough
 * for Python, TypeScript, Dart, and SQL samples to read like an editor, not a
 * full parser. Ported from the prototype.
 */
export type CodeLanguage = "py" | "ts" | "dart" | "sql";

type TokenKind = "kw" | "str" | "cm" | "num" | "fn" | "type" | "dec" | "p" | "id" | "ws";

export type Token = readonly [TokenKind, string];

const KEYWORDS: Record<CodeLanguage, ReadonlySet<string>> = {
  py: new Set(
    "from import as async def await return class if else elif for in while True False None with try except".split(
      " ",
    ),
  ),
  ts: new Set(
    "import from export default async function const let return await if else new type interface".split(
      " ",
    ),
  ),
  dart: new Set("void const class extends return super final var new import".split(" ")),
  sql: new Set(
    "create table primary key default not null text uuid timestamptz index on references insert into values select where".split(
      " ",
    ),
  ),
};

const COMMENT: Record<CodeLanguage, string> = {
  py: /#[^\n]*/.source,
  ts: /\/\/[^\n]*/.source,
  dart: /\/\/[^\n]*/.source,
  sql: /--[^\n]*/.source,
};
const STRING = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/.source;
const DECORATOR = /@[A-Za-z_][\w.]*/.source;
const NUMBER = /\b\d+(?:\.\d+)?\b/.source;
const IDENTIFIER = /[A-Za-z_$][\w$]*/.source;

/** Splits code into coloured tokens. Concatenating every token's text gives back the code. */
export function tokenize(code: string, language: CodeLanguage): Token[] {
  const pattern = new RegExp(
    `(${COMMENT[language]})|(${STRING})|(${DECORATOR})|(${NUMBER})|(${IDENTIFIER})|(\\s+)|([\\s\\S])`,
    "g",
  );
  const tokens: Token[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(code))) {
    const [text] = match;
    let kind: TokenKind = "p";
    if (match[1]) kind = "cm";
    else if (match[2]) kind = "str";
    else if (match[3]) kind = "dec";
    else if (match[4]) kind = "num";
    else if (match[5]) {
      const next = code.slice(pattern.lastIndex).match(/^\s*(.)/);
      const word = language === "sql" ? text.toLowerCase() : text;
      if (KEYWORDS[language].has(word)) kind = "kw";
      else if (next?.[1] === "(") kind = "fn";
      else if (/^[A-Z]/.test(text)) kind = "type";
      else kind = "id";
    } else if (match[6]) kind = "ws";
    tokens.push([kind, text]);
  }
  return tokens;
}

/** The first `count` characters of the tokenized code, as tokens (the last one possibly cut). */
export function sliceTokens(tokens: readonly Token[], count: number): Token[] {
  const out: Token[] = [];
  let left = count;
  for (const [kind, text] of tokens) {
    if (left <= 0) break;
    out.push([kind, text.slice(0, left)]);
    left -= text.length;
  }
  return out;
}

/** Line and column of the caret after `count` characters, 1-based, as an editor shows them. */
export function caretPosition(code: string, count: number): { line: number; column: number } {
  const typed = code.slice(0, count);
  const line = typed.split("\n").length;
  return { line, column: typed.length - typed.lastIndexOf("\n") };
}
