import { Module } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import { PlotPointsController } from './plot-points.controller';
import { DatabaseModule } from '../database/database.module';
import { AiUserMessagePlotPointsController } from './ai-message-plot-points.controller';
import { HumanUserMessagePlotPointsController } from './human-user-message-plot-points.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    PlotPointsController,
    HumanUserMessagePlotPointsController,
    AiUserMessagePlotPointsController,
  ],
  providers: [PlotPointsService],
  exports: [PlotPointsService],
})
export class PlotPointsModule {}
