import { describe, it, expect } from "bun:test";
import React from "react";
import txt from "../src/txt";

describe("txt function", () => {
  it("should convert a React node to markdown", () => {
    expect(txt(<strong>Bold Text</strong>)).toBe("**Bold Text**");
  });

  it("should handle more complex HTML structures", () => {
    const result = txt(
      <div>
        <h1>Title</h1>
        <p>
          Some <strong>bold</strong> text.
        </p>
      </div>,
    );
    expect(result).toBe(`# Title\n\nSome **bold** text.`);
  });
});
