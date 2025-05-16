import { InferSelectModel } from "drizzle-orm";
import { environments } from "../../db/app.schema";
import { ENVIRONMENT_AI_TASK_STATE } from "./environment.constants";

export type Environment = InferSelectModel<typeof environments>;
export type EnvironmentAiTaskState = (typeof ENVIRONMENT_AI_TASK_STATE)[number];
export type ActiveEnvironmentAiTaskState = Exclude<
  EnvironmentAiTaskState,
  "COMPLETE" | "FAILED"
>;
