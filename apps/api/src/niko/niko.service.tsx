import { PlotPointDto } from '@2pm/core';
import { BaseMessage, SystemMessage } from '@langchain/core/messages';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { txt } from '@2pm/core/utils';
import { PlotPoints } from '@2pm/core/db/app/services';
import { BaseCharacterService } from '../base-character-service/base-character-service';

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
export class NikoService extends BaseCharacterService {
  private static SYSTEM_PROMPT = txt(
    <>
      {super.BASE_SYSTEM_PROMPT}
      <p>You are @niko an honourable, helpful bot</p>
    </>,
  );

  async react(narrative: PlotPointDto[]) {
    const messages = [
      new SystemMessage(NikoService.SYSTEM_PROMPT),
      ...PlotPoints.toChain(narrative),
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

  async *respond(narrative: PlotPointDto[]) {
    const messages: BaseMessage[] = [
      new SystemMessage(NikoService.SYSTEM_PROMPT),
      new SystemMessage(
        txt(
          <>
            Respond in natural language. Do NOT include JSON in your response
          </>,
        ),
      ),
      ...PlotPoints.toChain(narrative),
    ];
    yield* super.baseRespond(messages);
  }
}
