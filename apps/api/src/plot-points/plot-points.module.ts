import { Module } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import { PlotPointsController } from './plot-points.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PlotPointsController],
  providers: [PlotPointsService],
})
export class PlotPointsModule {}
