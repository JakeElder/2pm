import { Module } from '@nestjs/common';
import { EnvironmentsGateway } from './environments.gateway';
import { EnvironmentsController } from './environments.controller';
import { DatabaseModule } from '../database/database.module';
import { PlotPointsModule } from '../plot-points/plot-points.module';

@Module({
  imports: [DatabaseModule, PlotPointsModule],
  providers: [EnvironmentsGateway],
  exports: [EnvironmentsGateway],
  controllers: [EnvironmentsController],
})
export class EnvironmentsModule {}
