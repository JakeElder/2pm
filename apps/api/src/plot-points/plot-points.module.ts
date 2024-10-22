import { Module } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import { PlotPointsController } from './plot-points.controller';
import { AuthenticatedUserMessagePlotPointsController } from './authenticated-user-message-plot-points.controller';
import { DatabaseModule } from '../database/database.module';
import { AiUserMessagePlotPointsController } from './ai-message-plot-points.controller';
import { AnonymousUserMessagePlotPointsController } from './anonymous-user-message-plot-points.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    PlotPointsController,
    AnonymousUserMessagePlotPointsController,
    AuthenticatedUserMessagePlotPointsController,
    AiUserMessagePlotPointsController,
  ],
  providers: [PlotPointsService],
  exports: [PlotPointsService],
})
export class PlotPointsModule {}
