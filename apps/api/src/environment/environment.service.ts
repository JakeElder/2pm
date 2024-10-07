import CharacterEngine from '@2pm/character-engine';
import { PlotPointDto } from '@2pm/data/dtos';
import { Inject, Injectable } from '@nestjs/common';
import { PlotPointsGateway } from '../plot-points/plot-points.gateway';

@Injectable()
export class EnvironmentService {
  constructor(
    @Inject('CE') private readonly ce: CharacterEngine,
    private readonly plotPointsGateway: PlotPointsGateway,
  ) {}

  respondCompanionOneToOne(environmentId: number) {
    // const environment = this.getEnvironmentByEnvironmentId(environmentId);
    // this.ce.evaluate(environment);
  }

  sendPlotPointCreated(plotPoint: PlotPointDto) {
    this.plotPointsGateway.sendPlotPointCreated(plotPoint);
  }

  // handleHumanMessageCreated(dto: HumanMessageDto) {
  //   this.plotPointsGateway.sendPlotPointUpdate(
  //     dto.environment.id,
  //     dto.plotPoint,
  //   );
  // }
}
