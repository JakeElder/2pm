import CharacterEngine from '@2pm/character-engine';
import { HydratedPlotPointDto } from '@2pm/data/dtos';
import { Inject, Injectable } from '@nestjs/common';
import { EnvironmentsGateway } from './environments.gateway';

@Injectable()
export class EnvironmentService {
  constructor(
    @Inject('CE') private readonly ce: CharacterEngine,
    private readonly environmentsGateway: EnvironmentsGateway,
  ) {}

  respondCompanionOneToOne(environmentId: number) {
    // const environment = this.getEnvironmentByEnvironmentId(environmentId);
    // this.ce.evaluate(environment);
  }

  sendPlotPointCreated(plotPoint: HydratedPlotPointDto) {
    this.environmentsGateway.sendPlotPointCreated(plotPoint);
  }

  // handleHumanMessageCreated(dto: HumanMessageDto) {
  //   this.plotPointsGateway.sendPlotPointUpdate(
  //     dto.environment.id,
  //     dto.plotPoint,
  //   );
  // }
}
