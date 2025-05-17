import {
  ChainPlotPoint,
  CharacterResponseEvent,
  HumanMessageDto,
  ThemeDtoSchema,
} from '@2pm/core';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { txt } from '@2pm/core/utils';
import { BaseCharacterService } from '../base-character-service/base-character-service';
import { PlotPoints } from '@2pm/core/db/services';

const switchTheme = {
  name: 'SWITCH_THEME',
  description: txt(<>Switch the users theme</>),
  schema: z.object({
    themeId: ThemeDtoSchema.shape.id,
  }),
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
    yield { type: 'IDENTIFYING_TOOLS' };

    const context = await this.getContext(trigger);

    const messages = this.preparePrompt({
      type: 'ACT',
      data: {
        chain,
        context,
        persona: TinyService.PERSONA,
      },
    });

    const res = await this.qwen.invoke(messages, {
      tools: [switchTheme],
      tool_choice: 'any',
      response_format: null as any,
    });

    const call = res.tool_calls?.[0];

    if (call && call.name === 'SWITCH_THEME') {
      yield { type: 'ACTING' };

      const humanUserTheme = await this.db.humanUserThemes.findByHumanUserId(
        trigger.user.data.id,
      );

      if (!humanUserTheme) {
        throw new Error();
      }

      const dto = await this.db.humanUserThemes.update({
        id: humanUserTheme.id,
        environmentId: trigger.environment.id,
        themeId: call.args.themeId,
      });

      yield { type: 'PLOT_POINT_CREATED', data: dto };

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

    const context = await this.getContext(trigger);

    const messages = this.preparePrompt({
      type: 'REPLY',
      data: {
        chain,
        actionChain,
        persona: TinyService.PERSONA,
        context,
      },
    });

    yield* super.reply(messages);
  }
}
