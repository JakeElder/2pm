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

const PERFORM_PALI_CANON_VECTOR_QUERY = {
  name: 'PERFORM_PALI_CANON_VECTOR_QUERY',
  description: txt(
    <>
      Searches a vector database of pali canon passages, using specific terms
      extracted from all available context
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
            Assemble the query from all available plot points that are relevant
          </li>
        </ul>,
      ),
    ),
  }),
};

const SELECT_PALI_CANON_PASSAGE = {
  name: 'SELECT_PALI_CANON_PASSAGE',
  description: txt(
    <>
      Selects the UID of a pali canon passage from a given array
      <ul>
        <li>Choose the best passage</li>
        <li>Select one that best fits the context</li>
        <li>It should be a complete passage, not a fragment</li>
        <li>Try to avoid ones that already appear in the context</li>
      </ul>
    </>,
  ),
  schema: z.object({
    uid: z.string().describe('The uid of the selected passage'),
  }),
};

@Injectable()
export class NoteService extends BaseCharacterService {
  private static PERSONA = txt(
    <>
      You are @note an honourable, helpful bot, and expert in buddhist
      teachings.
    </>,
  );

  async selectPassage(chain: ChainPlotPoint[], passages: any[]) {
    const messages = this.preparePrompt({
      type: 'ACT',
      data: {
        chain,
        persona: NoteService.PERSONA,
        instructions: [
          new SystemMessage(
            'Select the most suitable passage from the following array',
          ),
          new SystemMessage(JSON.stringify(passages)),
        ],
      },
    });

    const res = await this.qwen.invoke(messages, {
      tools: [SELECT_PALI_CANON_PASSAGE],
      tool_choice: {
        type: 'function',
        name: 'SELECT_PALI_CANON_PASSAGE',
      },
      response_format: null as any,
    });

    const call = res.tool_calls?.[0];

    if (!call || !call.args.uid) {
      throw new Error();
    }

    return call.args.uid;
  }

  async *act(
    chain: ChainPlotPoint[],
    trigger: HumanMessageDto,
  ): AsyncGenerator<CharacterResponseEvent> {
    yield { type: 'IDENTIFYING_TOOLS' };

    const messages = this.preparePrompt({
      type: 'ACT',
      data: {
        chain,
        persona: NoteService.PERSONA,
        instructions: [
          new SystemMessage('Choose the best tool. No tool selection is fine'),
        ],
      },
    });

    const res = await this.qwen.invoke(messages, {
      tools: [PERFORM_PALI_CANON_VECTOR_QUERY],
      tool_choice: '',
      response_format: null as any,
    });

    const call = res.tool_calls?.[0];

    if (call && call.name === 'PERFORM_PALI_CANON_VECTOR_QUERY') {
      const { query } = call.args;

      if (!query) {
        throw new Error();
      }

      yield { type: 'ACTING' };

      const chunks = await this.db.paliCanonPassages.vectorQuery(query);
      const uid = await this.selectPassage(chain, chunks);

      const chunk = chunks.find((c) => c.metadata.uid === uid);

      if (!chunk) {
        throw new Error();
      }

      const plotPoint = await this.db.paliCanonReferences.create({
        paliCanonChunkId: chunk.id,
        environmentId: trigger.environment.id,
        userId: trigger.user.data.userId,
      });

      yield {
        type: 'PLOT_POINT_CREATED',
        data: {
          type: 'PALI_CANON_REFERENCE',
          data: plotPoint,
        },
      };

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
        actionChain,
        persona: NoteService.PERSONA,
      },
    });

    yield* super.reply(messages);
  }
}
