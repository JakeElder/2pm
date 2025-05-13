import { ChatTogetherAI } from '@langchain/community/chat_models/togetherai';
import { type CharacterResponseEvent, PlotPointDto } from '@2pm/core';
import { SystemMessage } from '@langchain/core/messages';
import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { txt } from '@2pm/core/utils';
import { ChatDeepSeek } from '@langchain/deepseek';
import { type DBService } from '@2pm/core/db';

const politeDecline = {
  name: 'politeDecline',
  description: txt(
    <>
      Declines to fulfil the users request as it falls outside of your
      capabilities
    </>,
  ),
  schema: z.object({}),
};

const respondGeneral = {
  name: 'respondGeneral',
  description: txt(
    <>The user may ask general questions about the current narrative</>,
  ),
  schema: z.object({}),
};

const findBibleVerse = {
  name: 'findBibleVerse',
  description: 'Finds a bible verse based on long form similary text',
  schema: z.object({
    text: z
      .string()
      .describe(
        txt(
          <>
            The text to search for. This can contain keywords and phrases from
            the entire conversation chain. Include as much context and detail
            from the context available as possible. IE, be very specific and
            include important verbs, adjectives and details. Do not omit points
            that my be contentious. Be respectful to the provided content.
          </>,
        ),
      ),
  }),
};

@Injectable()
export class NikoService {
  private qwen: ChatTogetherAI;
  private deepSeek: ChatDeepSeek;

  constructor(@Inject('DB') private readonly db: DBService) {
    this.deepSeek = new ChatDeepSeek({
      modelName: 'deepseek-chat',
      streaming: true,
    });

    this.qwen = new ChatTogetherAI({
      model: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
      streaming: true,
    });
  }

  async react(narrative: PlotPointDto[]) {
    const messages = [
      new SystemMessage(
        txt(
          <>
            <p>
              You are @niko an honourable, helpful bot. A series of "plot
              points" and surrounding messages will follow. You should be able
              to identify your response based on the data. Pick the appropriate
              tool to progress the narrative. Try to consider the interface that
              is produced as a result of the plot points
            </p>
            <p>
              AI and Human messages will be prefixed with context in the format
              [[*]][message], where * represents a JSON object
            </p>
          </>,
        ),
      ),
      ...this.db.app.plotPoints.toChain(narrative),
    ];

    const res = await this.qwen.invoke(messages, {
      tools: [findBibleVerse, respondGeneral, politeDecline],
      tool_choice: 'any',
      response_format: {
        type: 'json_object',
        schema: {},
      },
    });
  }

  async *respond(
    narrative: PlotPointDto[],
  ): AsyncGenerator<CharacterResponseEvent> {
    yield { type: 'THINKING' };

    const stream = await this.deepSeek.stream([
      new SystemMessage(
        txt(
          <>
            You are @niko. A series of "plot points" will follow. You should be
            able to identify your response based on the data. do NOT respond
            with JSON data. respond in natural language as though you can
            visualise the user interface resulting from the plot points.
          </>,
        ),
      ),
      ...narrative.map((p) => new SystemMessage(JSON.stringify(p, null, 2))),
    ]);

    yield { type: 'RESPONDING' };

    for await (const chunk of stream) {
      yield { type: 'CHUNK', chunk: `${chunk.content}` };
    }

    yield { type: 'COMPLETE' };
  }
}
