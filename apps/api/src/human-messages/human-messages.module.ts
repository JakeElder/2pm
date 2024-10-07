import { Module } from '@nestjs/common';
import { HumanMessagesService } from './human-messages.service';
import { HumanMessagesController } from './human-messages.controller';
import { DatabaseModule } from '../database/database.module';
import { PlotPointsGateway } from '../plot-points/plot-points.gateway';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { EnvironmentModule } from '../environments/environments.module';

@Module({
  imports: [DatabaseModule, CharacterEngineModule, EnvironmentModule],
  controllers: [HumanMessagesController],
  providers: [HumanMessagesService, PlotPointsGateway],
})
export class HumanMessagesModule {}
