import { test } from 'bun:test';
import { NikoService } from './niko.service';
import { DatabaseModule } from '../database/database.module';
import { Test } from '@nestjs/testing';
import { DBService } from '@2pm/core/db';
import { ChainPlotPoint } from '@2pm/core';
import { txt } from '@2pm/core/utils';

test('react should choose the correct function', async () => {
  const m = await Test.createTestingModule({
    imports: [DatabaseModule],
    providers: [NikoService],
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

  const niko = m.get<NikoService>(NikoService);

  const chain: ChainPlotPoint[] = [
    {
      type: 'HUMAN_MESSAGE',
      data: {
        date: new Date(),
        message: txt(
          <>
            There are a lot of strange and nonsensical things in the media, it
            is making people unwell and anxious. Are there any passages in the
            bible that might bring comfort.
          </>,
        ),
        user: {
          type: 'AUTHENTICATED',
          id: 1,
          tag: 'jake',
        },
      },
    },
  ];

  // console.log(await niko.extractVectorQueryTerms(chain));
}, 60_000);
