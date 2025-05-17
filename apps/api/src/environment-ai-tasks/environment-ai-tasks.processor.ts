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
  CharacterGeneratingResponseEvent,
  CharacterRespondingEvent,
  CharacterChunkEvent,
  CharacterCompleteEvent,
  AiUserId,
  HumanMessageDto,
  CharacterActingEvent,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';
import { Processor, Process } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { aiUsers } from '@2pm/core/db/app-schema';
import { PlotPoints } from '@2pm/core/db/services';
import { AppEventEmitter } from '../event-emitter';
import { NikoService } from '../niko/niko.service';
import { TinyService } from '../tiny/tiny.service';
import { BaseCharacterService } from '../base-character-service/base-character-service';
import { NoteService } from '../note/note.service';

type LoadingAiTaskProcess = {
  state: 'LOADING';
};

type ActingAiTaskProcess = {
  state: 'ACTING';
  narrative: PlotPointDto[];
  environment: Environment;
  aiUser: AiUser;
  task: EnvironmentAiTaskDto;
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
  | ActingAiTaskProcess
  | ThinkingAiTaskProcess
  | RespondingAiTaskProcess;

@Processor('environment-ai-tasks')
export class EnvironmentAiTasksProcessor {
  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly niko: NikoService,
    private readonly tiny: TinyService,
    private readonly note: NoteService,
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
      await this.run(job);
    } catch (e) {
      console.error(e);
      await this.fail(environment.id);
    }
  }

  async fail(environmentId: Environment['id']) {
    const process = this.processes.get(environmentId);

    if (!process) {
      return;
    }

    if (process.state !== 'LOADING') {
      this.db.environmentAiTasks.update({
        id: process.task.id,
        state: 'FAILED',
      });

      this.events.emit('environment-ai-tasks.completed', { environmentId });
    }

    this.processes.delete(environmentId);
  }

  async run(job: AiResponseJob) {
    const { environment } = job.data.message;

    this.processes.set(environment.id, {
      state: 'LOADING',
    });

    const narrative = await this.db.plotPoints.findByEnvironmentId(
      job.data.message.environment.id,
      { reverse: true },
    );

    const [aiUser] = await this.db.app.drizzle
      .select()
      .from(aiUsers)
      .where(eq(aiUsers.id, job.data.aiUserId));

    const task = await this.db.environmentAiTasks.create({
      aiUserId: aiUser.id,
      environmentId: environment.id,
      state: 'THINKING',
    });

    this.processes.set(environment.id, {
      state: 'THINKING',
      narrative,
      environment,
      aiUser,
      task,
    });

    this.events.emit(
      'environment-ai-tasks.updated',
      ActiveEnvironmentAiTaskDtoSchema.parse(task),
    );

    const characters: Record<AiUserId, BaseCharacterService | null> = {
      NIKO: this.niko,
      TINY: this.tiny,
      NOTE: this.note,
      WHY: null,
      ALBERT: null,
      PROSE: null,
      VENUS: null,
    };

    const character = characters[aiUser.id];

    if (!character) {
      throw new Error(`${aiUser.id} not implemented`);
    }

    await this.respond(job.data.message, character);
  }

  async respond(trigger: HumanMessageDto, character: BaseCharacterService) {
    const process = this.processes.get(trigger.environment.id);

    if (!process || process.state === 'LOADING') {
      throw new Error();
    }

    const chain = PlotPoints.toChain(process.narrative);

    for await (const event of character.react(chain, trigger)) {
      await this.handleResponseEvent(event, trigger.environment.id);
    }
  }

  handleResponseEvent(
    event: CharacterResponseEvent,
    environmentId: Environment['id'],
  ) {
    if (event.type === 'IDENTIFYING_TOOLS') {
      return;
    }

    if (event.type === 'ACTING') {
      return this.handleActingEvent(event, environmentId);
    }

    if (event.type === 'PLOT_POINT_CREATED') {
      this.events.emit('plot-points.created', event.data);
      return;
    }

    if (event.type === 'GENERATING_RESPONSE') {
      return this.handleGeneratingResponseEvent(event, environmentId);
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

  async handleActingEvent(
    _: CharacterActingEvent,
    environmentId: Environment['id'],
  ) {
    const process = this.processes.get(environmentId);

    if (!process || process.state === 'LOADING') {
      throw new Error();
    }

    this.processes.set(environmentId, {
      ...process,
      state: 'ACTING',
    });

    const task = await this.db.environmentAiTasks.update({
      id: process.task.id,
      state: 'ACTING',
    });

    this.events.emit(
      'environment-ai-tasks.updated',
      ActiveEnvironmentAiTaskDtoSchema.parse(task),
    );
  }

  async handleGeneratingResponseEvent(
    _: CharacterGeneratingResponseEvent,
    environmentId: Environment['id'],
  ) {
    const process = this.processes.get(environmentId);

    if (!process) {
      throw new Error();
    }

    // If no action was taken, we're already in thinking state
    if (process.state !== 'ACTING') {
      return;
    }

    this.processes.set(environmentId, {
      ...process,
      state: 'THINKING',
    });

    const task = await this.db.environmentAiTasks.update({
      id: process.task.id,
      state: 'THINKING',
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

    const task = await this.db.environmentAiTasks.update({
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

    const message = await this.db.aiMessages.update({
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

    const aiMessage = await this.db.aiMessages.create({
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

    await this.db.environmentAiTasks.update({
      id: process.task.id,
      state: 'COMPLETE',
    });

    this.events.emit('environment-ai-tasks.completed', {
      environmentId: process.environment.id,
    });

    this.processes.delete(environmentId);
  }
}
