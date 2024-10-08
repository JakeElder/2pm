import CharacterEngine from '@2pm/character-engine';
import { HydratedPlotPoint } from '@2pm/data';
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

  sendPlotPointCreated(plotPoint: HydratedPlotPoint) {
    this.environmentsGateway.sendPlotPointCreated(plotPoint);
  }

  // handleHumanMessageCreated(dto: HumanMessageDto) {
  //   this.plotPointsGateway.sendPlotPointUpdate(
  //     dto.environment.id,
  //     dto.plotPoint,
  //   );
  // }
}
