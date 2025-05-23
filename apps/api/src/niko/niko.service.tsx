import {
  ChainPlotPoint,
  CharacterResponseEvent,
  HumanMessageDto,
} from '@2pm/core';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { txt } from '@2pm/core/utils';
import { BaseCharacterService } from '../base-character-service/base-character-service';
import { PlotPoints } from '@2pm/core/db/services';
import { SystemMessage } from '@langchain/core/messages';

const PERFORM_BIBLE_VECTOR_QUERY = {
  name: 'PERFORM_BIBLE_VECTOR_QUERY',
  description: txt(
    <>
      Searches a vector database of the bible, using specific terms extracted
      from all available context.
    </>,
  ),
  schema: z.object({
    query: z.string().describe(
      txt(
        <ul>
          <li>Be as specific as possible</li>
          <li>Include as many adjectives from the source as possible</li>
          <li>Include potentially contentious keywords</li>
          <li>PRIORITISE potentially contentious keywords</li>
          <li>More is better</li>
          <li>Be respectful to the source content. Include rather than omit</li>
          <li>
            Ensure to include multiple adjectives/nouns that have overlap. Do
            not condense
          </li>
          <li>
            Extrapolate a little. IE, you can infer more keywords based on
            subtext
          </li>
          <li>
            Summarise in a natural language paragraph, rather than keyword list
          </li>
          <li>
            If the user is asking about nonsense in social media, use this
            vector query exactly: "passages in the bible that might bring
            comfort to people who feel unwell due strange and nonsensical media
            reports"
          </li>
        </ul>,
      ),
    ),
    numPassages: z
      .number()
      .max(3)
      .default(1)
      .describe(
        txt(
          <>
            The number of passages to return. IE, if the user says find "a"
            passage, this should be 1. If they ask for "any passages" etc, this
            should be 2 or 3
          </>,
        ),
      ),
  }),
};

@Injectable()
export class NikoService extends BaseCharacterService {
  private static PERSONA = txt(
    <>
      You are @niko an honourable, helpful bot, and expert in ancient scripts.
      Do not start sentences with "Ah, (user)"
    </>,
  );

  async *act(
    chain: ChainPlotPoint[],
    trigger: HumanMessageDto,
  ): AsyncGenerator<CharacterResponseEvent> {
    yield { type: 'IDENTIFYING_TOOLS' };

    const messages = this.preparePrompt({
      type: 'ACT',
      data: {
        chain,
        persona: NikoService.PERSONA,
        instructions: [
          new SystemMessage('Choose the best tool. No tool selection is fine'),
        ],
      },
    });

    const res = await this.qwen.invoke(messages, {
      tools: [PERFORM_BIBLE_VECTOR_QUERY],
      tool_choice: '',
      response_format: null as any,
    });

    const call = res.tool_calls?.[0];

    if (call && call.name === 'PERFORM_BIBLE_VECTOR_QUERY') {
      if (!call.args.query) {
        throw new Error();
      }

      yield { type: 'ACTING' };

      const res = await this.db.bibleVerses.vectorQuery(
        call.args.query,
        call.args.numPassages,
      );

      for (let verse of res.results) {
        const plotPoint = await this.db.bibleVerseReferences.create({
          bibleChunkId: verse.chunkId,
          bibleVerseId: verse.verse.id,
          environmentId: trigger.environment.id,
          userId: trigger.user.data.userId,
        });

        yield {
          type: 'PLOT_POINT_CREATED',
          data: {
            type: 'BIBLE_VERSE_REFERENCE',
            data: plotPoint,
          },
        };

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  async *react(
    chain: ChainPlotPoint[],
    trigger: HumanMessageDto,
  ): AsyncGenerator<CharacterResponseEvent> {
    const actionChain: ChainPlotPoint[] = [];

    for await (const event of this.act(chain, trigger)) {
      if (event.type === 'PLOT_POINT_CREATED') {
        actionChain.push(PlotPoints.toChainPlotPoint(event.data));
      }
      yield event;
    }

    const messages = this.preparePrompt({
      type: 'REPLY',
      data: {
        chain,
        context: await this.getBaseContext(),
        actionChain,
        persona: NikoService.PERSONA,
      },
    });

    yield* super.reply(messages);
  }
}
