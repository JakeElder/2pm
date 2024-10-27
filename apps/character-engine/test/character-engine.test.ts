import { describe, it, beforeAll, expect } from "bun:test";
import CharacterEngine from "../src/index";
import { PlotPointSummaryDto } from "@2pm/data";

let ce: CharacterEngine | null = null;

beforeAll(() => {
  ce = new CharacterEngine();
});

describe("evaluate", () => {
  it("should evaluate to REQUEST_EMAIL_ADDRESS when necessary", async () => {
    const narrative: PlotPointSummaryDto[] = [
      {
        type: "ANONYMOUS_USER_MESSAGE",
        data: {
          user: { id: 1 },
          anonymousUserMessage: { content: "Hi, log me in" },
          message: { id: 1 },
          anonymousUser: { id: "cbab331a-4fda-4af3-a93e-46eec572a089" },
        },
      },
    ];

    const res = await ce!.evaluate(narrative, { debug: true });
    expect(res.tool).toEqual("REQUEST_EMAIL_ADDRESS");
  });

  it("should evaluate to SEND_AUTH_EMAIL when necessary", async () => {
    const narrative: PlotPointSummaryDto[] = [
      {
        type: "ANONYMOUS_USER_MESSAGE",
        data: {
          user: { id: 1 },
          anonymousUserMessage: { content: "Hi, log me in" },
          message: { id: 1 },
          anonymousUser: { id: "cbab331a-4fda-4af3-a93e-46eec572a089" },
        },
      },
      {
        type: "EVALUATION",
        data: {
          tool: { code: "REQUEST_EMAIL_ADDRESS" },
          user: { id: 2 },
          aiUser: { code: "G" },
          evaluation: { args: {} },
        },
      },
      {
        type: "AI_USER_MESSAGE",
        data: {
          user: { id: 2 },
          aiUserMessage: { content: "Sure, but I need your email address" },
          message: { id: 1 },
          aiUser: { code: "G" },
        },
      },
      {
        type: "ANONYMOUS_USER_MESSAGE",
        data: {
          user: { id: 1 },
          anonymousUserMessage: { content: "Oh right, it's jake@gmail.com" },
          message: { id: 1 },
          anonymousUser: { id: "cbab331a-4fda-4af3-a93e-46eec572a089" },
        },
      },
    ];

    const res = await ce!.evaluate(narrative, { debug: true });
    // console.dir(res, { depth: null, colors: true });
    expect(res.tool).toEqual("SEND_AUTH_EMAIL");
    expect(res.args).toEqual({ email: "jake@gmail.com" });
  });

  it("responds after sending an email", async () => {
    const narrative: PlotPointSummaryDto[] = [
      {
        type: "ANONYMOUS_USER_MESSAGE",
        data: {
          user: { id: 1 },
          anonymousUserMessage: { content: "Hi, log me in" },
          message: { id: 1 },
          anonymousUser: { id: "cbab331a-4fda-4af3-a93e-46eec572a089" },
        },
      },
      {
        type: "EVALUATION",
        data: {
          tool: { code: "REQUEST_EMAIL_ADDRESS" },
          user: { id: 2 },
          aiUser: { code: "G" },
          evaluation: { args: {} },
        },
      },
      {
        type: "AI_USER_MESSAGE",
        data: {
          user: { id: 2 },
          aiUserMessage: { content: "Sure, but I need your email address" },
          message: { id: 1 },
          aiUser: { code: "G" },
        },
      },
      {
        type: "ANONYMOUS_USER_MESSAGE",
        data: {
          user: { id: 1 },
          anonymousUserMessage: { content: "Oh right, it's jake@gmail.com" },
          message: { id: 1 },
          anonymousUser: { id: "cbab331a-4fda-4af3-a93e-46eec572a089" },
        },
      },
      {
        type: "EVALUATION",
        data: {
          tool: { code: "SEND_AUTH_EMAIL" },
          evaluation: {
            args: { email: "jake@gmail.com" },
          },
          user: { id: 2 },
          aiUser: { code: "G" },
        },
      },
      {
        type: "AUTH_EMAIL_SENT",
        data: {
          user: { id: 1 },
          anonymousUser: { id: "cbab331a-4fda-4af3-a93e-46eec572a089" },
          authEmail: {
            email: "jake@gmail.com",
          },
        },
      },
    ];

    const res = await ce!.evaluate(narrative, { debug: true });
    // console.dir(res, { depth: null, colors: true });
    expect(res.tool).toEqual("CONFIRM_AUTH_EMAIL_SENT");
  });

  it("processes auth tokens", async () => {
    const narrative: PlotPointSummaryDto[] = [
      {
        type: "ANONYMOUS_USER_MESSAGE",
        data: {
          user: { id: 1 },
          anonymousUserMessage: { content: "Hi, log me in" },
          message: { id: 1 },
          anonymousUser: { id: "cbab331a-4fda-4af3-a93e-46eec572a089" },
        },
      },
      {
        type: "EVALUATION",
        data: {
          tool: { code: "REQUEST_EMAIL_ADDRESS" },
          user: { id: 2 },
          aiUser: { code: "G" },
          evaluation: { args: {} },
        },
      },
      {
        type: "AI_USER_MESSAGE",
        data: {
          user: { id: 2 },
          aiUserMessage: { content: "Sure, but I need your email address" },
          message: { id: 1 },
          aiUser: { code: "G" },
        },
      },
      {
        type: "ANONYMOUS_USER_MESSAGE",
        data: {
          user: { id: 1 },
          anonymousUserMessage: { content: "Oh right, it's jake@gmail.com" },
          message: { id: 1 },
          anonymousUser: { id: "cbab331a-4fda-4af3-a93e-46eec572a089" },
        },
      },
      {
        type: "EVALUATION",
        data: {
          tool: { code: "SEND_AUTH_EMAIL" },
          evaluation: {
            args: { email: "jake@gmail.com" },
          },
          user: { id: 2 },
          aiUser: { code: "G" },
        },
      },
      {
        type: "AUTH_EMAIL_SENT",
        data: {
          user: { id: 1 },
          anonymousUser: { id: "cbab331a-4fda-4af3-a93e-46eec572a089" },
          authEmail: {
            email: "jake@gmail.com",
          },
        },
      },
      {
        type: "EVALUATION",
        data: {
          tool: { code: "CONFIRM_AUTH_EMAIL_SENT" },
          evaluation: { args: { email: "jake@gmail.com" } },
          user: { id: 2 },
          aiUser: { code: "G" },
        },
      },
      {
        type: "AI_USER_MESSAGE",
        data: {
          user: { id: 2 },
          aiUserMessage: {
            content:
              "Ok. That's sent, you can tell me the code and I'll log you in",
          },
          message: { id: 1 },
          aiUser: { code: "G" },
        },
      },
      {
        type: "EVALUATION",
        data: {
          tool: { code: "NOOP" },
          evaluation: { args: {} },
          user: { id: 2 },
          aiUser: { code: "G" },
        },
      },
      {
        type: "ANONYMOUS_USER_MESSAGE",
        data: {
          user: { id: 1 },
          anonymousUserMessage: { content: "Ok - the code is 15132" },
          message: { id: 1 },
          anonymousUser: { id: "cbab331a-4fda-4af3-a93e-46eec572a089" },
        },
      },
    ];

    const res = await ce!.evaluate(narrative, { debug: true });
    // console.dir(res, { depth: null, colors: true });

    expect(res.tool).toBe("PROCESS_AUTH_TOKEN");
    expect(res.args).toEqual({ token: "15132" });
  });
});
