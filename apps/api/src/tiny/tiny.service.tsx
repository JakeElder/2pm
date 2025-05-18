import {
  ChainPlotPoint,
  CharacterResponseEvent,
  CreateThemeDtoSchema,
  HumanMessageDto,
  ThemeDtoSchema,
} from '@2pm/core';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { txt } from '@2pm/core/utils';
import { PlotPoints } from '@2pm/core/db/services';
import { SystemMessage } from '@langchain/core/messages';
import { BaseCharacterService } from '../base-character-service/base-character-service';

const SWITCH_THEME = {
  name: 'SWITCH_THEME',
  description: txt(<>Switch the users theme</>),
  schema: z.object({
    themeId: ThemeDtoSchema.shape.id,
  }),
};

const CREATE_THEME = {
  name: 'CREATE_THEME',
  description: txt(
    <>
      You are a color theory expert. Creates a new theme
      <ul>
        <li>The themes use Catppuccin's theme system</li>
        <li>It is comprised of 12 core colors, and 14 named colors</li>
        <li>Pay close attention to existing themes</li>
        <li>
          There are built in systems to ensure proper contrast. IE, the 12 core
          colors should complement each other in terms of contrast. The visual
          difference between the values you create, should be similar to that of
          the light or dark themes
        </li>
        <li>The alias values reference one of the 26 theme colors</li>
      </ul>
    </>,
  ),
  schema: CreateThemeDtoSchema.omit({
    id: true,
    environmentId: true,
    userId: true,
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
        instructions: [
          new SystemMessage(
            'Use a tool call if the user wants to create or switch theme',
          ),
        ],
        persona: TinyService.PERSONA,
      },
    });

    const res = await this.qwen.invoke(messages, {
      tools: [SWITCH_THEME, CREATE_THEME],
      tool_choice: 'any',
      response_format: null as any,
    });

    const call = res.tool_calls?.[0];

    if (!call) {
      return;
    }

    yield { type: 'ACTING' };

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (call.name === 'SWITCH_THEME') {
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

    if (call.name === 'CREATE_THEME') {
      const args = CreateThemeDtoSchema.parse({
        ...call.args,
        environmentId: trigger.environment.id,
        userId: trigger.user.data.userId,
      });

      console.log(args);
      const dto = await this.db.themes.create(args);

      yield {
        type: 'PLOT_POINT_CREATED',
        data: { type: 'THEME_CREATED', data: dto },
      };
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
