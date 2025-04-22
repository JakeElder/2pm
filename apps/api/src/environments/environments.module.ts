import { Module } from '@nestjs/common';
import { EnvironmentGateway } from './environments.gateway';
import { EnvironmentsController } from './environments.controller';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { DatabaseModule } from '../database/database.module';
import { MessagesModule } from '../messages/messages.module';
import { PlotPointsModule } from '../plot-points/plot-points.module';
import { RedisModule } from '../redis/redis.module';
import { CompanionEnvironmentsController } from './companion-environments.controller';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { EnvironmentsProcessor } from './environments.processor';

@Module({
  imports: [
    DatabaseModule,
    CharacterEngineModule,
    MessagesModule,
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
  exports: [],
  controllers: [EnvironmentsController, CompanionEnvironmentsController],
})
export class EnvironmentModule {}
