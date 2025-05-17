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

const politeDecline = {
  name: 'politeDecline',
  description: txt(
    <>
      Declines to fulfill the users request as it falls outside of your
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
  private static PERSONA = txt(
    <>
      You are @niko an honourable, helpful bot, and expert in ancient scripts.
    </>,
  );

  async getContext(trigger: HumanMessageDto) {
    const themes = await this.db.themes.findAll();
    const humanUserTheme = await this.db.humanUserThemes.findByHumanUserId(
      trigger.user.data.id,
    );

    if (!humanUserTheme) {
      throw new Error();
    }

    return {
      availableThemes: themes,
      activeThemeId: humanUserTheme.theme.id,
    };
  }

  async *act(
    chain: ChainPlotPoint[],
    trigger: HumanMessageDto,
  ): AsyncGenerator<CharacterResponseEvent> {
    // const vars: PrompTemplatePlaceholders = {
    //   persona: [new SystemMessage(TinyService.PERSONA)],
    //   formatting: [],
    //   context: [
    //     new SystemMessage(JSON.stringify(await this.getContext(trigger))),
    //   ],
    //   plotPoints: BaseCharacterService.chainToMessages(chain),
    // };
    //
    // const { messages } =
    //   await BaseCharacterService.PROMPT_TEMPLATE.invoke(vars);
    //
    // const res = await this.qwen.invoke(messages, {
    //   tools: [switchTheme, informThemeAlreadyActive],
    //   tool_choice: 'any',
    //   response_format: null as any,
    // });
    //
    // return res.tool_calls;
    // yield { type: 'IDENTIFYING_TOOLS' };
    // yield { type: 'ACTING' };
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    // yield { type: 'PLOT_POINT_CREATED', data: { message: 'hi' } as any };
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

    const context = await this.getContext(trigger);

    const messages = this.preparePrompt({
      type: 'REPLY',
      data: {
        chain,
        actionChain,
        persona: NikoService.PERSONA,
        context,
      },
    });

    yield* super.reply(messages);
  }
}
