import { Controller, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ThemesGateway } from './themes.gateway';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('Human User Themes')
@Controller()
export class ThemesController {
  constructor(
    @Inject('E') protected readonly events: AppEventEmitter,
    private readonly gateway: ThemesGateway,
  ) {}

  async onModuleInit() {
    this.events.on('plot-points.created', ({ type, data }) => {
      if (type === 'THEME_UPDATED') {
        this.gateway.server
          .to(`${data.theme.id}`)
          .emit('updated', { type, data });
      }
    });
  }
}
