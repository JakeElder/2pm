import { Module } from '@nestjs/common';
import { PlotPointsController } from './plot-points.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PlotPointsController],
})
export class PlotPointsModule {}
