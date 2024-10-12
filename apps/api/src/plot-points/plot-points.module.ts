import { Module } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import { PlotPointsController } from './plot-points.controller';
import { HumanMessagePlotPointsController } from './human-message-plot-points.controller';
import { DatabaseModule } from '../database/database.module';
import { AiMessagePlotPointsController } from './ai-message-plot-points.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    PlotPointsController,
    HumanMessagePlotPointsController,
    AiMessagePlotPointsController,
  ],
  providers: [PlotPointsService],
  exports: [PlotPointsService],
})
export class PlotPointsModule {}
