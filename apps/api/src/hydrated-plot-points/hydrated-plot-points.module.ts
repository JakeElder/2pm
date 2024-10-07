import { Module } from '@nestjs/common';
import { HydratedPlotPointsService } from './hydrated-plot-points.service';
import { HydratedPlotPointsController } from './hydrated-plot-points.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HydratedPlotPointsController],
  providers: [HydratedPlotPointsService],
})
export class HydratedPlotPointsModule {}
