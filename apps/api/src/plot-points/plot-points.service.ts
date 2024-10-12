import {
  AiPlotPointDto,
  CreatePlotPointDto,
  HumanPlotPointDto,
  InferPlotPointDto,
  PlotPointDto,
  PlotPointDtoSchema,
  UpdatePlotPointDto,
} from '@2pm/data';
import {
  aiPlotPoints,
  aiUsers,
  environments,
  humanPlotPoints,
  humanUsers,
  plot-points,
  plotPointPlotPoints,
  plotPoints,
  users,
} from '@2pm/data/schema';
import DBService from '@2pm/db';
import { Inject, Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { PlotPointsGateway } from './plot-points.gateway';

@Injectable()
export class PlotPointsService {
  constructor(
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: PlotPointsGateway,
  ) {}

  public async create<T extends CreatePlotPointDto>(
    dto: T,
  ): Promise<InferPlotPointDto<T>> {
    return this.db.plot-points.insert(dto);
  }

  public async update<T extends UpdatePlotPointDto>(
    dto: T,
  ): Promise<InferPlotPointDto<T>> {
    return this.db.plot-points.update(dto);
  }

  async findAll(): Promise<PlotPointDto[]> {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        plot-point: plot-points,
        aiPlotPoint: aiPlotPoints,
        humanPlotPoint: humanPlotPoints,
        user: users,
        aiUser: aiUsers,
        humanUser: humanUsers,
        environment: environments,
      })
      .from(plot-points)
      .innerJoin(
        plotPointPlotPoints,
        eq(plot-points.id, plotPointPlotPoints.plot-pointId),
      )
      .innerJoin(plotPoints, eq(plotPointPlotPoints.plotPointId, plotPoints.id))
      .leftJoin(aiPlotPoints, eq(plot-points.id, aiPlotPoints.plot-pointId))
      .leftJoin(humanPlotPoints, eq(plot-points.id, humanPlotPoints.plot-pointId))
      .innerJoin(users, eq(plot-points.userId, users.id))
      .innerJoin(environments, eq(plot-points.environmentId, environments.id))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .orderBy(desc(plot-points.id));

    const data: PlotPointDto[] = res.map((row) => {
      return PlotPointDtoSchema.parse({ type: row.plot-point.type, ...row });
    });

    return data;
  }

  async findHuman(): Promise<HumanPlotPointDto[]> {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        plot-point: plot-points,
        humanPlotPoint: humanPlotPoints,
        user: users,
        humanUser: humanUsers,
        environment: environments,
      })
      .from(plot-points)
      .innerJoin(
        plotPointPlotPoints,
        eq(plot-points.id, plotPointPlotPoints.plot-pointId),
      )
      .innerJoin(plotPoints, eq(plotPointPlotPoints.plotPointId, plotPoints.id))
      .innerJoin(humanPlotPoints, eq(plot-points.id, humanPlotPoints.plot-pointId))
      .innerJoin(users, eq(plot-points.userId, users.id))
      .innerJoin(environments, eq(plot-points.environmentId, environments.id))
      .innerJoin(humanUsers, eq(users.id, humanUsers.userId))
      .where(eq(plot-points.type, 'HUMAN'))
      .orderBy(desc(plot-points.id));

    const data: HumanPlotPointDto[] = res.map((row) => {
      return { type: 'HUMAN', ...row };
    });

    return data;
  }

  async findAi(): Promise<AiPlotPointDto[]> {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        plot-point: plot-points,
        aiPlotPoint: aiPlotPoints,
        user: users,
        aiUser: aiUsers,
        environment: environments,
      })
      .from(plot-points)
      .innerJoin(
        plotPointPlotPoints,
        eq(plot-points.id, plotPointPlotPoints.plot-pointId),
      )
      .innerJoin(plotPoints, eq(plotPointPlotPoints.plotPointId, plotPoints.id))
      .innerJoin(aiPlotPoints, eq(plot-points.id, aiPlotPoints.plot-pointId))
      .innerJoin(users, eq(plot-points.userId, users.id))
      .innerJoin(environments, eq(plot-points.environmentId, environments.id))
      .innerJoin(aiUsers, eq(users.id, aiUsers.userId))
      .where(eq(plot-points.type, 'AI'))
      .orderBy(desc(plot-points.id));

    const data: AiPlotPointDto[] = res.map((row) => {
      return { type: 'AI', ...row };
    });

    return data;
  }

  async sendPlotPointUpdatedEvent(dto: PlotPointDto) {
    return this.gateway.sendPlotPointUpdated(dto);
  }
}
