import { test } from 'bun:test';
import { NikoService } from './niko.service';
import { PlotPointDto } from '@2pm/core';
import { DatabaseModule } from 'src/database/database.module';
import { Test } from '@nestjs/testing';
import { AppDBService } from '@2pm/core/db';

const narrative: PlotPointDto[] = [
  {
    type: 'HUMAN_MESSAGE',
    data: {
      plotPoint: {
        id: 965,
        userId: 123,
        environmentId: 67,
        type: 'HUMAN_MESSAGE',
        createdAt: new Date('2025-05-12T02:43:06.506Z'),
      },
      humanMessage: {
        id: 165,
        json: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'mention',
                  attrs: {
                    id: 'NOTE',
                    label: 'note',
                  },
                },
                {
                  type: 'text',
                  text: ' ',
                },
              ],
            },
          ],
        },
        text: '@note ',
        messageId: 201,
      },
      environment: {
        id: 67,
        type: 'WORLD_ROOM',
      },
      user: {
        type: 'AUTHENTICATED',
        data: {
          id: 'e53d0031-25ff-469a-80a6-7a409798940a',
          tag: 'jake',
          userId: 123,
          hash: 'uiPPWCDYHWcSbXLjXtN5Yb',
        },
      },
    },
  },
  {
    type: 'HUMAN_MESSAGE',
    data: {
      plotPoint: {
        id: 964,
        userId: 123,
        environmentId: 67,
        type: 'HUMAN_MESSAGE',
        createdAt: new Date('2025-05-12T02:05:56.499Z'),
      },
      humanMessage: {
        id: 164,
        json: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "There's a lot of strange things and things that don't make sense in the media, it makes a lot of people feel unwell. Are there any passages in the bible that might bring comfort",
                },
              ],
            },
          ],
        },
        text: "There's a lot of strange things and things that don't make sense in the media, it makes a lot of people feel unwell. Are there any passages in the bible that might bring comfort",
        messageId: 200,
      },
      environment: {
        id: 67,
        type: 'WORLD_ROOM',
      },
      user: {
        type: 'AUTHENTICATED',
        data: {
          id: 'e53d0031-25ff-469a-80a6-7a409798940a',
          tag: 'jake',
          userId: 123,
          hash: 'uiPPWCDYHWcSbXLjXtN5Yb',
        },
      },
    },
  },
  {
    type: 'ENVIRONMENT_ENTERED',
    data: {
      plotPoint: {
        id: 963,
        userId: 124,
        environmentId: 67,
        type: 'ENVIRONMENT_ENTERED',
        createdAt: new Date('2025-05-12T01:56:44.191Z'),
      },
      environment: {
        id: 67,
        type: 'WORLD_ROOM',
      },
      userEnvironmentPresence: {
        id: 441,
        userId: 124,
        environmentId: 67,
        expired: null,
      },
      user: {
        type: 'ANONYMOUS',
        data: {
          id: '55b4258b-78d8-4f6d-9d49-f8deb6596eb2',
          userId: 124,
          hash: 'bzPpBpGuB7NGVK76hsxnx1',
        },
      },
    },
  },
  {
    type: 'HUMAN_MESSAGE',
    data: {
      plotPoint: {
        id: 962,
        userId: 123,
        environmentId: 67,
        type: 'HUMAN_MESSAGE',
        createdAt: new Date('2025-05-12T01:56:41.253Z'),
      },
      humanMessage: {
        id: 163,
        json: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'thank you ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  text: 'sir',
                },
              ],
            },
          ],
        },
        text: 'thank you sir',
        messageId: 199,
      },
      environment: {
        id: 67,
        type: 'WORLD_ROOM',
      },
      user: {
        type: 'AUTHENTICATED',
        data: {
          id: 'e53d0031-25ff-469a-80a6-7a409798940a',
          tag: 'jake',
          userId: 123,
          hash: 'uiPPWCDYHWcSbXLjXtN5Yb',
        },
      },
    },
  },
  {
    type: 'AI_MESSAGE',
    data: {
      plotPoint: {
        id: 961,
        userId: 122,
        environmentId: 67,
        type: 'AI_MESSAGE',
        createdAt: new Date('2025-05-12T01:56:41.248Z'),
      },
      aiMessage: {
        id: 35,
        content: 'Welcome to the 2pm universe',
        messageId: 198,
        state: 'COMPLETE',
      },
      environment: {
        id: 67,
        type: 'WORLD_ROOM',
      },
      aiUser: {
        id: 'NIKO',
        tag: 'niko',
        userId: 122,
        bio: 'Niko is our host.',
      },
    },
  },
  {
    type: 'ENVIRONMENT_ENTERED',
    data: {
      plotPoint: {
        id: 960,
        userId: 120,
        environmentId: 67,
        type: 'ENVIRONMENT_ENTERED',
        createdAt: new Date('2025-05-12T01:56:41.243Z'),
      },
      environment: {
        id: 67,
        type: 'WORLD_ROOM',
      },
      userEnvironmentPresence: {
        id: 440,
        userId: 120,
        environmentId: 67,
        expired: null,
      },
      user: {
        type: 'AI',
        data: {
          id: 'WHY',
          tag: 'why',
          userId: 120,
          bio: 'Why is a general knowledge expert.',
        },
      },
    },
  },
  {
    type: 'ENVIRONMENT_ENTERED',
    data: {
      plotPoint: {
        id: 959,
        userId: 123,
        environmentId: 67,
        type: 'ENVIRONMENT_ENTERED',
        createdAt: new Date('2025-05-12T01:56:41.242Z'),
      },
      environment: {
        id: 67,
        type: 'WORLD_ROOM',
      },
      userEnvironmentPresence: {
        id: 439,
        userId: 123,
        environmentId: 67,
        expired: null,
      },
      user: {
        type: 'AUTHENTICATED',
        data: {
          id: 'e53d0031-25ff-469a-80a6-7a409798940a',
          tag: 'jake',
          userId: 123,
          hash: 'uiPPWCDYHWcSbXLjXtN5Yb',
        },
      },
    },
  },
  {
    type: 'ENVIRONMENT_ENTERED',
    data: {
      plotPoint: {
        id: 958,
        userId: 121,
        environmentId: 67,
        type: 'ENVIRONMENT_ENTERED',
        createdAt: new Date('2025-05-12T01:56:41.242Z'),
      },
      environment: {
        id: 67,
        type: 'WORLD_ROOM',
      },
      userEnvironmentPresence: {
        id: 438,
        userId: 121,
        environmentId: 67,
        expired: null,
      },
      user: {
        type: 'AI',
        data: {
          id: 'NOTE',
          tag: 'note',
          userId: 121,
          bio: 'Note is an expert on Buddhist teachings.',
        },
      },
    },
  },
  {
    type: 'ENVIRONMENT_ENTERED',
    data: {
      plotPoint: {
        id: 957,
        userId: 122,
        environmentId: 67,
        type: 'ENVIRONMENT_ENTERED',
        createdAt: new Date('2025-05-12T01:56:41.233Z'),
      },
      environment: {
        id: 67,
        type: 'WORLD_ROOM',
      },
      userEnvironmentPresence: {
        id: 437,
        userId: 122,
        environmentId: 67,
        expired: null,
      },
      user: {
        type: 'AI',
        data: {
          id: 'NIKO',
          tag: 'niko',
          userId: 122,
          bio: 'Niko is our host.',
        },
      },
    },
  },
] as const;

test('react should choose the correct function', async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule],
    providers: [NikoService],
  })
    .overrideProvider('DB')
    .useFactory({
      factory: () => {
        return {
          app: new AppDBService(process.env.APP_DATABASE_URL!),
        };
      },
    })
    .compile();

  const service = moduleRef.get<NikoService>(NikoService);
  await service.react(narrative);
}, 60_000);
