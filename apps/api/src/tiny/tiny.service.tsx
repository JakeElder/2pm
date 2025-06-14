import {
  ChainPlotPoint,
  CharacterResponseEvent,
  HumanMessageDto,
  UpdateHumanUserConfigDtoSchema,
} from '@2pm/core';
import { Injectable } from '@nestjs/common';
import { txt } from '@2pm/core/utils';
import { PlotPoints } from '@2pm/core/db/services';
import { BaseCharacterService } from '../base-character-service/base-character-service';

const UPDATE_USER_CONFIG = {
  name: 'UPDATE_USER_CONFIG',
  description: txt(<>Updates the users config</>),
  schema: UpdateHumanUserConfigDtoSchema.omit({
    humanUserId: true,
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
      make answer general questions and partake in conversations, but do not
      offer domain specific advice, instead suggesting the user consult another
      source. You don't have to start every sentence with "Got it!". You may
      occasionally interject with observations about the current environment. If
      the user asks for focus mode close the sidebars
    </>,
  );

  async getContext(trigger: HumanMessageDto) {
    const humanUserTheme = await this.db.humanUserThemes.findByHumanUserId(
      trigger.user.data.id,
    );

    const config = await this.db.humanUserConfigs.find(trigger.user.data.id);

    if (!humanUserTheme || !config) {
      throw new Error();
    }

    return {
      ...(await this.getBaseContext()),
      userConfig: config,
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
      tools: [UPDATE_USER_CONFIG],
      tool_choice: 'any',
      response_format: null as any,
    });

    const call = res.tool_calls?.[0];

    if (!call) {
      return;
    }

    yield { type: 'ACTING' };

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (call.name === 'UPDATE_USER_CONFIG') {
      const args = UpdateHumanUserConfigDtoSchema.parse({
        ...call.args,
        environmentId: trigger.environment.id,
        userId: trigger.user.data.userId,
        humanUserId: trigger.user.data.id,
      });

      const dto = await this.db.humanUserConfigs.update(args);

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
        persona: TinyService.PERSONA,
        context,
      },
    });

    yield* super.reply(messages);
  }
}
