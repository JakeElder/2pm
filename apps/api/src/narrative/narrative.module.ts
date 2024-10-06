import { Module } from '@nestjs/common';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { NarrativeService } from './narrative.service';
import { PlotPointsGateway } from '../plot-points/plot-points.gateway';

@Module({
  imports: [CharacterEngineModule],
  providers: [NarrativeService, PlotPointsGateway],
  exports: [NarrativeService],
})
export class NarrativeModule {}
