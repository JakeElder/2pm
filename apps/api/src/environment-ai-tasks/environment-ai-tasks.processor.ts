import { eq } from 'drizzle-orm';
import {
  ActiveEnvironmentAiTaskDtoSchema,
  Environment,
  PlotPointDto,
  type AiResponseJob,
  type CharacterResponseEvent,
  type AiUser,
  EnvironmentAiTaskDto,
  AiMessageDto,
  CharacterThinkingEvent,
  CharacterRespondingEvent,
  CharacterChunkEvent,
  CharacterCompleteEvent,
} from '@2pm/core';
import { type DBService } from '@2pm/core/db';
import { Processor, Process } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { AppEventEmitter } from '../event-emitter';
import { aiUsers } from '@2pm/core/db/app/schema';
import { NikoService } from '../niko/niko.service';

type LoadingAiTaskProcess = {
  state: 'LOADING';
};

type InitialisingAiTaskProcess = {
  state: 'INITIALISING';
  narrative: PlotPointDto[];
  environment: Environment;
  aiUser: AiUser;
};

type ThinkingAiTaskProcess = {
  state: 'THINKING';
  narrative: PlotPointDto[];
  environment: Environment;
  aiUser: AiUser;
  task: EnvironmentAiTaskDto;
};

type RespondingAiTaskProcess = {
  state: 'RESPONDING';
  response: string;
  narrative: PlotPointDto[];
  environment: Environment;
  aiUser: AiUser;
  aiMessage: AiMessageDto;
  task: EnvironmentAiTaskDto;
};

type AiTaskProcess =
  | LoadingAiTaskProcess
  | InitialisingAiTaskProcess
  | ThinkingAiTaskProcess
  | RespondingAiTaskProcess;

@Processor('environment-ai-tasks')
export class EnvironmentAiTasksProcessor {
  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly niko: NikoService,
  ) {}

  private processes = new Map<Environment['id'], AiTaskProcess>();

  @Process({ concurrency: 10 })
  async process(job: AiResponseJob) {
    const { environment } = job.data.message;

    try {
      if (this.processes.has(environment.id)) {
        console.error(`Existing task: environment ${environment.id}`);
        return;
      }
      this.run(job);
    } catch (e) {
      console.error(e);
      this.processes.delete(environment.id);
    }
  }

  async run(job: AiResponseJob) {
    const { environment } = job.data.message;

    this.processes.set(environment.id, {
      state: 'LOADING',
    });

    const narrative = await this.db.app.plotPoints.findByEnvironmentId(
      job.data.message.environment.id,
      { reverse: true },
    );

    const [aiUser] = await this.db.app.drizzle
      .select()
      .from(aiUsers)
      .where(eq(aiUsers.id, job.data.aiUserId));

    this.processes.set(environment.id, {
      state: 'INITIALISING',
      narrative,
      environment,
      aiUser,
    });

    await this.respond(environment.id);
  }

  async respond(environmentId: Environment['id']) {
    const process = this.processes.get(environmentId);

    if (!process || process.state !== 'INITIALISING') {
      throw new Error();
    }

    for await (const event of this.niko.respond(process.narrative)) {
      await this.handleResponseEvent(event, environmentId);
    }
  }

  handleResponseEvent(
    event: CharacterResponseEvent,
    environmentId: Environment['id'],
  ) {
    if (event.type === 'THINKING') {
      return this.handleThinkingEvent(event, environmentId);
    }

    if (event.type === 'RESPONDING') {
      return this.handleRespondingEvent(event, environmentId);
    }

    if (event.type === 'CHUNK') {
      return this.handleChunkEvent(event, environmentId);
    }

    if (event.type === 'COMPLETE') {
      return this.handleCompleteEvent(event, environmentId);
    }

    throw new Error();
  }

  async handleThinkingEvent(
    _: CharacterThinkingEvent,
    environmentId: Environment['id'],
  ) {
    const process = this.processes.get(environmentId);

    if (!process || process.state !== 'INITIALISING') {
      throw new Error();
    }

    const task = await this.db.app.environmentAiTasks.create({
      aiUserId: process.aiUser.id,
      environmentId: process.environment.id,
      state: 'THINKING',
    });

    this.processes.set(environmentId, {
      ...process,
      state: 'THINKING',
      task,
    });

    this.events.emit(
      'environment-ai-tasks.updated',
      ActiveEnvironmentAiTaskDtoSchema.parse(task),
    );
  }

  async handleRespondingEvent(
    _: CharacterRespondingEvent,
    environmentId: Environment['id'],
  ) {
    const process = this.processes.get(environmentId);

    if (!process || process.state !== 'THINKING') {
      throw new Error();
    }

    const task = await this.db.app.environmentAiTasks.update({
      id: process.task.id,
      state: 'RESPONDING',
    });

    this.events.emit(
      'environment-ai-tasks.updated',
      ActiveEnvironmentAiTaskDtoSchema.parse(task),
    );
  }

  async handleChunkEvent(
    event: CharacterChunkEvent,
    environmentId: Environment['id'],
  ) {
    if (event.chunk === '') {
      return;
    }

    const process = this.processes.get(environmentId);

    if (!process) {
      throw new Error();
    }

    if (process.state === 'THINKING') {
      return this.handleFirstChunkEvent(event, environmentId);
    }

    if (process.state !== 'RESPONDING') {
      throw new Error();
    }

    const message = await this.db.app.aiMessages.update({
      id: process.aiMessage.aiMessage.id,
      content: process.response + event.chunk,
    });

    this.events.emit('ai-messages.updated', message);

    this.processes.set(environmentId, {
      ...process,
      response: message.aiMessage.content,
    });
  }

  async handleFirstChunkEvent(
    event: CharacterChunkEvent,
    environmentId: Environment['id'],
  ) {
    const process = this.processes.get(environmentId);

    if (!process || process.state !== 'THINKING') {
      return;
    }

    const aiMessage = await this.db.app.aiMessages.create({
      content: event.chunk,
      environmentId: process.environment.id,
      state: 'STREAMING',
      userId: process.aiUser.userId,
    });

    this.events.emit('plot-points.created', {
      type: 'AI_MESSAGE',
      data: aiMessage,
    });

    this.processes.set(environmentId, {
      ...process,
      state: 'RESPONDING',
      response: event.chunk,
      aiMessage,
    });
  }

  async handleCompleteEvent(
    _: CharacterCompleteEvent,
    environmentId: Environment['id'],
  ) {
    const process = this.processes.get(environmentId);

    if (!process || process.state !== 'RESPONDING') {
      throw new Error();
    }

    await this.db.app.environmentAiTasks.update({
      id: process.task.id,
      state: 'COMPLETE',
    });

    this.events.emit('environment-ai-tasks.completed', {
      environmentId: process.environment.id,
    });

    this.processes.delete(environmentId);
  }
}
