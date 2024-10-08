import {
  AiMessageCreatedEventDto,
  EnvironmentRoomJoinedEventDto,
  HumanMessageCreatedEventDto,
} from '@2pm/data';

export type AppEvents = {
  /* Human Messages */
  'human-message.created': (body: HumanMessageCreatedEventDto) => void;

  /* Ai Messages */
  'ai-message.created': (body: AiMessageCreatedEventDto) => void;

  /* Environments */
  'environment.joined': (body: EnvironmentRoomJoinedEventDto) => void;
};
