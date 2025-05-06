import { Module } from '@nestjs/common';
import { EnvironmentGateway } from './environments.gateway';
import { EnvironmentsController } from './environments.controller';
import { DatabaseModule } from '../database/database.module';
import { PlotPointsModule } from '../plot-points/plot-points.module';
import { RedisModule } from '../redis/redis.module';
import { EnvironmentsProcessor } from './environments.processor';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    DatabaseModule,
    PlotPointsModule,
    RedisModule,
    BullModule.registerQueue({
      name: 'environments',
    }),
    BullBoardModule.forFeature({
      name: 'environments',
      adapter: BullAdapter,
    }),
  ],
  providers: [EnvironmentGateway, EnvironmentsProcessor],
  exports: [EnvironmentGateway],
  controllers: [EnvironmentsController],
})
export class EnvironmentsModule {}
