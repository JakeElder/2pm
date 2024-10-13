import { describe, it, expect, beforeAll } from "bun:test";
import CharacterEngine from "../src/index";
import fixture from "../fixtures/should-send-authentication-email";

let ce: CharacterEngine | null = null;

beforeAll(() => {
  ce = new CharacterEngine();
});

describe("evaluate", () => {
  it("should evaluate", async () => {
    console.dir(await ce?.evaluate(fixture), { depth: null, colors: true });
  });
});
