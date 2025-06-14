import {
  ChainPlotPoint,
  CharacterResponseEvent,
  CreateThemeDtoSchema,
  HumanMessageDto,
  ThemeDtoSchema,
  UpdateThemeDtoSchema,
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
        <li>Values are hex, without the preceding #</li>
      </ul>
    </>,
  ),
  schema: CreateThemeDtoSchema.omit({
    id: true,
    environmentId: true,
    userId: true,
  }),
};

const UPDATE_THEME = {
  name: 'UPDATE_THEME',
  description: txt(
    <>
      You are a color theory expert. Update a theme
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
        <li>You may partially update the theme</li>
        <li>Values are hex, without the preceding #</li>
      </ul>
    </>,
  ),
  schema: UpdateThemeDtoSchema,
};

const LIST_THEMES = {
  name: 'LIST_THEMES',
  description: txt(<>Lists the themes for the user</>),
  schema: z.object({}),
};

@Injectable()
export class IrisService extends BaseCharacterService {
  private static PERSONA = txt(
    <>
      You are @iris an honourable, helpful bot. You can create and manage
      themes. You make answer general questions and partake in conversations,
      but do not offer domain specific advice, instead suggesting the user
      consult another source. You don't have to start every sentence with "Got
      it!".
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
      ...(await this.getBaseContext()),
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
        persona: IrisService.PERSONA,
      },
    });

    const res = await this.qwen.invoke(messages, {
      tools: [SWITCH_THEME, CREATE_THEME, LIST_THEMES, UPDATE_THEME],
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

    if (call.name === 'LIST_THEMES') {
      const dto = await this.db.themeLists.create({
        environmentId: trigger.environment.id,
        userId: trigger.user.data.userId,
        themeIds: context.availableThemes.map((t) => t.id),
      });

      yield {
        type: 'PLOT_POINT_CREATED',
        data: { type: 'THEMES_LISTED', data: dto },
      };
    }

    if (call.name === 'CREATE_THEME') {
      const args = CreateThemeDtoSchema.omit({ id: true }).parse({
        ...call.args,
        environmentId: trigger.environment.id,
        userId: trigger.user.data.userId,
      });

      const dto = await this.db.themes.create(args);

      yield {
        type: 'PLOT_POINT_CREATED',
        data: { type: 'THEME_CREATED', data: dto },
      };
    }

    if (call.name === 'UPDATE_THEME') {
      const args = UpdateThemeDtoSchema.parse({
        ...call.args,
        environmentId: trigger.environment.id,
        userId: trigger.user.data.userId,
      });

      const dto = await this.db.themes.update(args);

      yield {
        type: 'PLOT_POINT_CREATED',
        data: dto,
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
        persona: IrisService.PERSONA,
        context,
      },
    });

    yield* super.reply(messages);
  }
}
