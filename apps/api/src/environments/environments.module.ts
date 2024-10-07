import { Module } from '@nestjs/common';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { EnvironmentService } from './environments.service';
import { PlotPointsGateway } from '../plot-points/plot-points.gateway';
import { EnvironmentController } from './environments.controller';

@Module({
  imports: [CharacterEngineModule],
  providers: [EnvironmentService, PlotPointsGateway],
  exports: [EnvironmentService],
  controllers: [EnvironmentController],
})
export class EnvironmentModule {}
