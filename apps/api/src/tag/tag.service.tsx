import {
  ChainPlotPoint,
  CharacterResponseEvent,
  HumanMessageDto,
  UpdateHumanUserTagDtoSchema,
} from '@2pm/core';
import { Injectable } from '@nestjs/common';
import { txt } from '@2pm/core/utils';
import { PlotPoints } from '@2pm/core/db/services';
import { SystemMessage } from '@langchain/core/messages';
import { BaseCharacterService } from '../base-character-service/base-character-service';

const UPDATE_USER_TAG = {
  name: 'UPDATE_USER_TAG',
  description: txt(<>Updates the users tag</>),
  schema: UpdateHumanUserTagDtoSchema.omit({
    humanUserId: true,
    environmentId: true,
  }),
};

@Injectable()
export class TagService extends BaseCharacterService {
  private static PERSONA = txt(
    <>
      You are @tag an honourable, helpful bot. You can update a users username
    </>,
  );

  async getContext(trigger: HumanMessageDto) {
    return {};
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
        persona: TagService.PERSONA,
      },
    });

    const res = await this.qwen.invoke(messages, {
      tools: [UPDATE_USER_TAG],
      tool_choice: 'any',
      response_format: null as any,
    });

    const call = res.tool_calls?.[0];

    if (!call) {
      return;
    }

    yield { type: 'ACTING' };

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (call.name === 'UPDATE_USER_TAG') {
      const args = UpdateHumanUserTagDtoSchema.parse({
        ...call.args,
        environmentId: trigger.environment.id,
        userId: trigger.user.data.userId,
        humanUserId: trigger.user.data.id,
      });

      const dto = await this.db.humanUsers.updateTag(args);

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
        persona: TagService.PERSONA,
        context,
      },
    });

    yield* super.reply(messages);
  }
}
