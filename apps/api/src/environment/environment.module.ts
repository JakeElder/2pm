import { Module } from '@nestjs/common';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { EnvironmentService } from './environment.service';
import { PlotPointsGateway } from '../plot-points/plot-points.gateway';
import { EnvironmentController } from './environment.controller';

@Module({
  imports: [CharacterEngineModule],
  providers: [EnvironmentService, PlotPointsGateway],
  exports: [EnvironmentService],
  controllers: [EnvironmentController],
})
export class EnvironmentModule {}
