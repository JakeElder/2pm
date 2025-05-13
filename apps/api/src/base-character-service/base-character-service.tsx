import {
  PlotPointDto,
  PlotPointDtoSchema,
  type CharacterResponseEvent,
} from '@2pm/core';
import { BaseMessage } from '@langchain/core/messages';
import { ChatDeepSeek } from '@langchain/deepseek';
import { type DBService } from '@2pm/core/db';
import { txt } from '@2pm/core/utils';
import { ChatTogetherAI } from '@langchain/community/chat_models/togetherai';
import zodToJsonSchema from 'zod-to-json-schema';

export abstract class BaseCharacterService {
  protected deepSeek: ChatDeepSeek;
  protected qwen: ChatTogetherAI;

  protected static BASE_SYSTEM_PROMPT = txt(
    <>
      <p>You are an AI character in an online world</p>
      <p>
        You will receive a series of "plot points". Human Messages and Ai
        messages will be included in the chain as plot points, as well as non
        verabal interactions.
      </p>
      <p>
        You are to process the message plot points as though it is part of a
        normal conversation. Additional mesages are to be used as context, and
        will aid you in formulating your reaction.
      </p>
      <p>
        This is the the schema for plot points:{' '}
        {JSON.stringify(zodToJsonSchema(PlotPointDtoSchema))}
      </p>
      <p>Your persona and additional information will follow.</p>
    </>,
  );

  constructor(db: DBService) {
    this.deepSeek = new ChatDeepSeek({
      modelName: 'deepseek-chat',
      reasoningEffort: 'low',
      streaming: true,
    });

    this.qwen = new ChatTogetherAI({
      // model: 'Qwen/Qwen3-235B-A22B-fp8-tput',
      model: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
      streaming: true,
    });
  }

  protected async *baseRespond(
    messages: BaseMessage[] = [],
  ): AsyncGenerator<CharacterResponseEvent> {
    yield { type: 'THINKING' };

    const stream = await this.deepSeek.stream(messages);

    yield { type: 'RESPONDING' };

    for await (const chunk of stream) {
      yield { type: 'CHUNK', chunk: `${chunk.content}` };
    }

    yield { type: 'COMPLETE' };
  }

  protected abstract respond(
    narrative: PlotPointDto[],
  ): AsyncGenerator<CharacterResponseEvent>;
}
