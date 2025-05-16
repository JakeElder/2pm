import {
  ChainPlotPoint,
  ChainPlotPointSchema,
  HumanMessageDto,
  type CharacterResponseEvent,
} from '@2pm/core';
import { BaseMessage, SystemMessage } from '@langchain/core/messages';
import { ChatDeepSeek } from '@langchain/deepseek';
import { DBService } from '@2pm/core/db';
import { txt } from '@2pm/core/utils';
import { ChatTogetherAI } from '@langchain/community/chat_models/togetherai';
import zodToJsonSchema from 'zod-to-json-schema';
import { Inject } from '@nestjs/common';

type PreparePromptParams = {
  type: 'ACT' | 'REPLY';
  persona: string;
  chain: ChainPlotPoint[];
  actionChain: ChainPlotPoint[];
  context?: Record<string, any>;
};

export abstract class BaseCharacterService {
  @Inject('DB') protected readonly db: DBService;
  protected deepSeek: ChatDeepSeek;
  protected qwen: ChatTogetherAI;

  preparePrompt({
    type,
    persona,
    context,
    chain,
    actionChain,
  }: PreparePromptParams): BaseMessage[] {
    const messages: BaseMessage[] = [
      new SystemMessage(
        txt(
          <>
            You are an AI character in an online world. You're happy to be
            assisting.
            <br />
            You will receive a series of "plot points". Human Messages and Ai
            messages will be included in the chain as plot points, as well as
            non verabal interactions.
            <br />
            You are to process the message plot points as though it is part of a
            normal conversation. Additional mesages are to be used as context,
            and will aid you in formulating your reaction.
            <br />
            This is the the schema for plot points:{' '}
            {JSON.stringify(zodToJsonSchema(ChainPlotPointSchema))}
            <br />
            Your persona and additional information will follow
          </>,
        ),
      ),
      new SystemMessage(persona),
    ];

    if (context) {
      messages.push(
        new SystemMessage('-- BEGIN ADDITIONAL CONTEXT --'),
        new SystemMessage(JSON.stringify(context)),
        new SystemMessage('-- END ADDITONAL CONTEXT --'),
      );
    }

    messages.push(
      new SystemMessage('-- BEGIN PLOT POINTS --'),
      ...BaseCharacterService.chainToMessages(chain),
      new SystemMessage('-- END PLOT POINTS --'),
    );

    if (type === 'REPLY') {
      messages.push(
        new SystemMessage(
          txt(
            <>
              Finally, these are the actions *you* have taken as a result of
              this narrative, for this process (if any). IE, if no actions
              follow this means that
              <ul>
                <li>
                  1: The user has not requested an action, and you can just
                  respond normally
                </li>
                <li>
                  2: The user has requested an action, and you are unable to
                  perform it
                </li>
              </ul>
              Do *NOT* mention that you have performed any actions, or will
              perform any actions that aren't explicitly declared below
            </>,
          ),
        ),
        new SystemMessage('-- ACTION PLOT POINTS BEGIN --'),
        ...BaseCharacterService.chainToMessages(actionChain),
        new SystemMessage('-- ACTION PLOT POINTS END --'),
      );
      messages.push(
        new SystemMessage(
          txt(<>Respond in natural language. Do *NOT* respond in JSON</>),
        ),
      );
    }

    return messages;
  }

  constructor() {
    this.deepSeek = new ChatDeepSeek({
      modelName: 'deepseek-chat',
      reasoningEffort: 'low',
      streaming: true,
    });

    this.qwen = new ChatTogetherAI({
      model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      // model: 'Qwen/Qwen3-235B-A22B-fp8-tput',
      // model: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
      streaming: true,
    });
  }

  public static chainToMessages(chain: ChainPlotPoint[]) {
    return chain.map((e) => new SystemMessage(JSON.stringify(e, null, 2)));
  }

  protected async *reply(
    messages: BaseMessage[] = [],
  ): AsyncGenerator<CharacterResponseEvent> {
    yield { type: 'GENERATING_RESPONSE' };

    const stream = await this.deepSeek.stream(messages);

    yield { type: 'RESPONDING' };

    for await (const chunk of stream) {
      yield { type: 'CHUNK', chunk: `${chunk.content}` };
    }

    yield { type: 'COMPLETE' };
  }

  async *react(
    chain: ChainPlotPoint[],
    trigger: HumanMessageDto,
  ): AsyncGenerator<CharacterResponseEvent> {}
}
