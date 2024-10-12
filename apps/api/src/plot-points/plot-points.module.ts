import { Module } from '@nestjs/common';
import { PlotPointsController } from './plot-points.controller';
import { PlotPointsService } from './plot-points.service';
import { DatabaseModule } from 'src/database/database.module';
import { EventEmitterModule } from 'src/event-emitter/event-emitter.module';
import { PlotPointsGateway } from './plot-points.gateway';

@Module({
  imports: [DatabaseModule, EventEmitterModule],
  controllers: [PlotPointsController],
  providers: [PlotPointsService, PlotPointsGateway],
  exports: [PlotPointsService],
})
export class PlotPointsModule {}
