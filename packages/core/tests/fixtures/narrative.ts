import { PlotPointDto } from "../../src/models/plot-point/plot-point.dto";

export const ONE: PlotPointDto[] = [
  {
    type: "ENVIRONMENT_ENTERED",
    data: {
      plotPoint: {
        id: 207,
        userId: 66,
        environmentId: 34,
        type: "ENVIRONMENT_ENTERED",
        createdAt: new Date("2025-05-15T11:31:36.818Z"),
      },
      environment: {
        id: 34,
        type: "WORLD_ROOM",
      },
      userEnvironmentPresence: {
        id: 102,
        userId: 66,
        environmentId: 34,
        expired: null,
      },
      user: {
        type: "ANONYMOUS",
        data: {
          id: "48a8a4fe-1dc4-4d7e-95d3-e7f21c2f2326",
          userId: 66,
          hash: "9YowGb3efvcLUL3hpUbvdJ",
        },
      },
    },
  },
  {
    type: "BIBLE_VERSE_REFERENCE",
    data: {
      plotPoint: {
        id: 206,
        userId: 62,
        environmentId: 34,
        type: "BIBLE_VERSE_REFERENCE",
        createdAt: new Date("2025-05-15T11:31:33.849Z"),
      },
      environment: {
        id: 34,
        type: "WORLD_ROOM",
      },
      bibleVerse: {
        id: 13127,
        bookId: 18,
        chapter: 11,
        verse: 18,
        text: "And thou shalt be secure, because there is hope; yea, thou shalt dig about thee, and thou shalt take thy rest in safety.",
        bookName: "Job",
      },
      bibleChunk: {
        id: 13127,
        content:
          "Because thou shalt forget thy misery, and remember it as waters that pass away: And thine age shall be clearer than the noonday; thou shalt shine forth, thou shalt be as the morning. And thou shalt be secure, because there is hope; yea, thou shalt dig about thee, and thou shalt take thy rest in safety. Also thou shalt lie down, and none shall make thee afraid; yea, many shall make suit unto thee. But the eyes of the wicked shall fail, and they shall not escape, and their hope shall be as the giving up of the ghost. ",
        metadata: {
          id: 13127,
          range: [0, 120],
          verse: 18,
          book_id: 18,
          chapter: 11,
        },
      },
    },
  },
  {
    type: "HUMAN_MESSAGE",
    data: {
      plotPoint: {
        id: 205,
        userId: 65,
        environmentId: 34,
        type: "HUMAN_MESSAGE",
        createdAt: new Date("2025-05-15T11:31:33.844Z"),
      },
      humanMessage: {
        id: 28,
        json: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "thank you ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  text: "sir",
                },
              ],
            },
          ],
        },
        text: "thank you sir",
        messageId: 49,
      },
      environment: {
        id: 34,
        type: "WORLD_ROOM",
      },
      user: {
        type: "AUTHENTICATED",
        data: {
          id: "d257a23e-bff8-419b-9cdc-bba6843f9bca",
          tag: "jake",
          userId: 65,
          hash: "rYuqwbcBTDnc5zkDQs9bK5",
        },
      },
    },
  },
  {
    type: "AI_MESSAGE",
    data: {
      plotPoint: {
        id: 204,
        userId: 62,
        environmentId: 34,
        type: "AI_MESSAGE",
        createdAt: new Date("2025-05-15T11:31:33.841Z"),
      },
      aiMessage: {
        id: 21,
        content: "Welcome to the 2pm universe",
        messageId: 48,
        state: "COMPLETE",
      },
      environment: {
        id: 34,
        type: "WORLD_ROOM",
      },
      aiUser: {
        id: "NIKO",
        tag: "niko",
        userId: 62,
        bio: "our host and ancient text expert",
      },
    },
  },
  {
    type: "ENVIRONMENT_ENTERED",
    data: {
      plotPoint: {
        id: 203,
        userId: 63,
        environmentId: 34,
        type: "ENVIRONMENT_ENTERED",
        createdAt: new Date("2025-05-15T11:31:33.836Z"),
      },
      environment: {
        id: 34,
        type: "WORLD_ROOM",
      },
      userEnvironmentPresence: {
        id: 101,
        userId: 63,
        environmentId: 34,
        expired: null,
      },
      user: {
        type: "AI",
        data: {
          id: "NOTE",
          tag: "note",
          userId: 63,
          bio: "an expert on buddhist teachings",
        },
      },
    },
  },
  {
    type: "ENVIRONMENT_ENTERED",
    data: {
      plotPoint: {
        id: 202,
        userId: 64,
        environmentId: 34,
        type: "ENVIRONMENT_ENTERED",
        createdAt: new Date("2025-05-15T11:31:33.836Z"),
      },
      environment: {
        id: 34,
        type: "WORLD_ROOM",
      },
      userEnvironmentPresence: {
        id: 100,
        userId: 64,
        environmentId: 34,
        expired: null,
      },
      user: {
        type: "AI",
        data: {
          id: "TINY",
          tag: "tiny",
          userId: 64,
          bio: "helps with config and small tasks",
        },
      },
    },
  },
  {
    type: "ENVIRONMENT_ENTERED",
    data: {
      plotPoint: {
        id: 201,
        userId: 65,
        environmentId: 34,
        type: "ENVIRONMENT_ENTERED",
        createdAt: new Date("2025-05-15T11:31:33.835Z"),
      },
      environment: {
        id: 34,
        type: "WORLD_ROOM",
      },
      userEnvironmentPresence: {
        id: 99,
        userId: 65,
        environmentId: 34,
        expired: null,
      },
      user: {
        type: "AUTHENTICATED",
        data: {
          id: "d257a23e-bff8-419b-9cdc-bba6843f9bca",
          tag: "jake",
          userId: 65,
          hash: "rYuqwbcBTDnc5zkDQs9bK5",
        },
      },
    },
  },
  {
    type: "ENVIRONMENT_ENTERED",
    data: {
      plotPoint: {
        id: 200,
        userId: 62,
        environmentId: 34,
        type: "ENVIRONMENT_ENTERED",
        createdAt: new Date("2025-05-15T11:31:33.829Z"),
      },
      environment: {
        id: 34,
        type: "WORLD_ROOM",
      },
      userEnvironmentPresence: {
        id: 98,
        userId: 62,
        environmentId: 34,
        expired: null,
      },
      user: {
        type: "AI",
        data: {
          id: "NIKO",
          tag: "niko",
          userId: 62,
          bio: "our host and ancient text expert",
        },
      },
    },
  },
];
