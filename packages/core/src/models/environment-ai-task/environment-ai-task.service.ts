import { not, eq, and } from "drizzle-orm";
import { AppDBServiceModule } from "../../db/app/app-db-service-module";
import { aiUsers, environmentAiTasks } from "../../db/app/app.schema";
import {
  CreateEnvironmentAiTaskDto,
  EnvironmentAiTaskDto,
  UpdateEnvironmentAiTaskDto,
} from "./environment-ai-task.dto";

export default class EnvironmentAiTasks extends AppDBServiceModule {
  async create(dto: CreateEnvironmentAiTaskDto): Promise<EnvironmentAiTaskDto> {
    const [aiUser] = await this.drizzle
      .select()
      .from(aiUsers)
      .where(eq(aiUsers.id, dto.aiUserId))
      .limit(1);

    if (!aiUser) {
      throw new Error();
    }

    const [environmentAiTask] = await this.drizzle
      .insert(environmentAiTasks)
      .values(dto)
      .returning();

    return {
      ...environmentAiTask,
      aiUser,
    };
  }

  async update({
    id,
    ...rest
  }: UpdateEnvironmentAiTaskDto): Promise<EnvironmentAiTaskDto> {
    const [environmentAiTask] = await this.drizzle
      .update(environmentAiTasks)
      .set({ ...rest })
      .where(eq(environmentAiTasks.id, id))
      .returning();

    const [aiUser] = await this.drizzle
      .select()
      .from(aiUsers)
      .where(eq(aiUsers.id, environmentAiTask.aiUserId))
      .limit(1);

    return {
      ...environmentAiTask,
      aiUser,
    };
  }

  async findByEnvironmentId(id: number): Promise<EnvironmentAiTaskDto | null> {
    const res = await this.drizzle
      .select({
        aiUser: aiUsers,
        environmentAiTask: environmentAiTasks,
      })
      .from(environmentAiTasks)
      .innerJoin(aiUsers, eq(aiUsers.id, environmentAiTasks.aiUserId))
      .where(
        and(
          eq(environmentAiTasks.environmentId, id),
          not(eq(environmentAiTasks.state, "COMPLETE")),
        ),
      )
      .orderBy(environmentAiTasks.createdAt)
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    return {
      ...res[0].environmentAiTask,
      aiUser: res[0].aiUser,
    };
  }
}
