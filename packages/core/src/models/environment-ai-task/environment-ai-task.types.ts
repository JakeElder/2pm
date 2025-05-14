import { Job } from "bull";
import { HumanMessageDto } from "../human-message/human-message.dto";
import { AiUserId } from "../ai-user/ai-user.types";
import { InferSelectModel } from "drizzle-orm";
import { environmentAiTasks } from "../../db/app.schema";

export type EnvironmentAiTask = InferSelectModel<typeof environmentAiTasks>;

export type AiResponseJob = Job<{
  message: HumanMessageDto;
  aiUserId: AiUserId;
}>;
