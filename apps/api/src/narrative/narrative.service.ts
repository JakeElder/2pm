import CharacterEngine from '@2pm/character-engine';
import { HumanMessageDto } from '@2pm/data/dtos';
import { Inject, Injectable } from '@nestjs/common';
import { PlotPointsGateway } from '../plot-points/plot-points.gateway';

@Injectable()
export class NarrativeService {
  constructor(
    @Inject('CE') private readonly ce: CharacterEngine,
    private readonly plotPointsGateway: PlotPointsGateway,
  ) {}

  handleHumanMessageCreated(dto: HumanMessageDto) {
    this.plotPointsGateway.sendPlotPointUpdate(
      dto.environment.id,
      dto.plotPoint,
    );
    this.ce.evaluate('a');
  }
}
