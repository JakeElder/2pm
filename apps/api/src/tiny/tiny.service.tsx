import {
  ChainPlotPoint,
  CharacterResponseEvent,
  HumanMessageDto,
  ThemeDtoSchema,
} from '@2pm/core';
import { SystemMessage } from '@langchain/core/messages';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { txt } from '@2pm/core/utils';
import { BaseCharacterService } from '../base-character-service/base-character-service';
import { ToolCall } from '@langchain/core/messages/tool';
import { PlotPoints } from '@2pm/core/db/services';

const switchTheme = {
  name: 'switchTheme',
  description: txt(<>Switch the users theme</>),
  schema: z.object({
    themeId: ThemeDtoSchema.shape.id,
  }),
};

const informThemeAlreadyActive = {
  name: 'informThemeAlreadyActive',
  description: txt(
    <>
      Invoked when the user tries to change to a theme that is already active
    </>,
  ),
  schema: z.object({}),
};

@Injectable()
export class TinyService extends BaseCharacterService {
  private static PERSONA = txt(
    <>
      You are @tiny an honourable, helpful bot. You are a general helper. You
      can do things like change the users theme. You make answer general
      questions and partake in conversations, but do not offer domain specific
      advice, instead suggesting the user consult another source.
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
      chain,
      actionChain,
      persona: TinyService.PERSONA,
      context,
    });

    yield* super.reply(messages);
  }
}
