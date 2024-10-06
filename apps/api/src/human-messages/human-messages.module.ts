import { Module } from '@nestjs/common';
import { HumanMessagesService } from './human-messages.service';
import { HumanMessagesController } from './human-messages.controller';
import { DatabaseModule } from '../database/database.module';
import { PlotPointsGateway } from '../plot-points/plot-points.gateway';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { NarrativeModule } from '../narrative/narrative.module';

@Module({
  imports: [DatabaseModule, CharacterEngineModule, NarrativeModule],
  controllers: [HumanMessagesController],
  providers: [HumanMessagesService, PlotPointsGateway],
})
export class HumanMessagesModule {}
