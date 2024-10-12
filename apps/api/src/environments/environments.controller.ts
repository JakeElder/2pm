import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { EnvironmentsRoomJoinedEventDto } from '@2pm/data';
import { messageDtoToHydratedPlotPointDto } from '@2pm/utils/adapters';
import { InjectQueue } from '@nestjs/bull';
import { type Queue } from 'bull';
import { EnvironmentService } from './environments.service';
import { AppEventEmitter } from '../event-emitter';
import { type BullBoardInstance, InjectBullBoard } from '@bull-board/nestjs';

@Controller()
export class EnvironmentController implements OnModuleInit {
  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    @InjectQueue('environment')
    private readonly queue: Queue<EnvironmentsRoomJoinedEventDto>,
    private readonly service: EnvironmentService,
    @InjectBullBoard() private readonly boardInstance: BullBoardInstance,
  ) {}

  onModuleInit() {
    this.events.on('environments.joined', (e) => {
      this.queue.add('processJoined', e);
    });
    this.events.on('messages.created', (e) => {
      this.service.sendPlotPointCreatedEvent(
        messageDtoToHydratedPlotPointDto(e),
      );
    });
  }
}
