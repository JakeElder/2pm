import { Module } from '@nestjs/common';
import { EnvironmentGateway } from './environments.gateway';
import { EnvironmentsController } from './environments.controller';
import { DatabaseModule } from '../database/database.module';
import { PlotPointsModule } from '../plot-points/plot-points.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [DatabaseModule, PlotPointsModule, RedisModule],
  providers: [EnvironmentGateway],
  exports: [EnvironmentGateway],
  controllers: [EnvironmentsController],
})
export class EnvironmentsModule {}
