import { Controller, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import CharacterEngine from '@2pm/character-engine';
import { HumanMessageCreatedEvent } from '@2pm/data/events';
import { EnvironmentService } from './environment.service';

@Controller()
export class EnvironmentController {
  constructor(
    @Inject('CE') private readonly ce: CharacterEngine,
    private readonly service: EnvironmentService,
  ) {}

  @OnEvent('human-message.created')
  onHumanMessageCreatedEvent(e: HumanMessageCreatedEvent) {
    this.service.sendPlotPointCreated(e.plotPoint);
  }
}
