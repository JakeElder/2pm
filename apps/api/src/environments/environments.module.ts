import { Module } from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { EnvironmentGateway } from './environments.gateway';
import { EnvironmentController } from './environments.controller';
import { EnvironmentQueueService } from './environments.queue.service';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { DatabaseModule } from '../database/database.module';
import { MessagesModule } from '../messages/messages.module';
import { PlotPointsModule } from '../plot-points/plot-points.module';
import { RedisModule } from '../redis/redis.module';
import { CompanionOneToOneEnvironmentsController } from './companion-one-to-one-environments.controller';

@Module({
  imports: [
    DatabaseModule,
    CharacterEngineModule,
    MessagesModule,
    PlotPointsModule,
    RedisModule,
  ],
  providers: [EnvironmentsService, EnvironmentGateway, EnvironmentQueueService],
  exports: [EnvironmentsService],
  controllers: [EnvironmentController, CompanionOneToOneEnvironmentsController],
})
export class EnvironmentModule {}
