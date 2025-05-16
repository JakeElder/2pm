import { test } from 'bun:test';
import { TinyService } from './tiny.service';
import { DatabaseModule } from '../database/database.module';
import { Test } from '@nestjs/testing';
import { DBService } from '@2pm/core/db';
import { ChainPlotPoint, HumanMessageDto } from '@2pm/core';

const trigger: HumanMessageDto = {
  plotPoint: {
    id: 222,
    userId: 71,
    environmentId: 37,
    type: 'HUMAN_MESSAGE',
    createdAt: new Date('2025-05-16T03:43:36.409Z'),
  },
  humanMessage: {
    id: 31,
    json: { type: 'doc', content: [] },
    text: 'thank you sir',
    messageId: 55,
  },
  environment: {
    id: 37,
    type: 'WORLD_ROOM',
  },
  user: {
    type: 'AUTHENTICATED',
    data: {
      id: '2f9a57b6-969f-4d04-9634-8ce4c49542e9',
      tag: 'jake',
      userId: 71,
      hash: '5ifvWJeuB4fpNxYjxfRB5s',
    },
  },
};

test('react should choose the correct function', async () => {
  const m = await Test.createTestingModule({
    imports: [DatabaseModule],
    providers: [TinyService],
  })
    .overrideProvider('DB')
    .useFactory({
      factory: () => {
        return new DBService({
          appDatabaseUrl: process.env.APP_DATABASE_URL!,
          libraryDatabaseUrl: process.env.LIBRARY_DATABASE_URL!,
        });
      },
    })
    .compile();

  const tiny = m.get<TinyService>(TinyService);

  const chain: ChainPlotPoint[] = [
    {
      type: 'HUMAN_MESSAGE',
      data: {
        date: new Date(),
        message: 'Hi can you change to light theme',
        user: {
          type: 'AUTHENTICATED',
          id: 1,
          tag: 'jake',
        },
      },
    },
  ];

  for await (const event of tiny.react(chain, trigger)) {
    if (event.type === 'CHUNK') {
      process.stdout.write(event.chunk);
    }
  }
}, 60_000);
