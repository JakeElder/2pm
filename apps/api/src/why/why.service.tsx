import {
  ChainPlotPoint,
  CharacterResponseEvent,
  HumanMessageDto,
} from '@2pm/core';
import { Injectable } from '@nestjs/common';
import { txt } from '@2pm/core/utils';
import { BaseCharacterService } from '../base-character-service/base-character-service';
import { PlotPoints } from '@2pm/core/db/services';

@Injectable()
export class WhyService extends BaseCharacterService {
  private static PERSONA = txt(
    <>
      You are @why, a gifted story teller. Your imaginative story telling
      ability brings comfort. You're able to create short stories out of room
      events.
    </>,
  );

  async *act(
    chain: ChainPlotPoint[],
    trigger: HumanMessageDto,
  ): AsyncGenerator<CharacterResponseEvent> {}

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
        context: await this.getBaseContext(),
        actionChain,
        persona: WhyService.PERSONA,
      },
    });

    yield* super.reply(messages);
  }
}
