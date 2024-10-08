import {
  AiMessageCreatedEventDto,
  AiMessageUpdatedEventDto,
  EnvironmentsRoomJoinedEventDto,
  HumanMessageCreatedEventDto,
} from '@2pm/data';

export type AppEvents = {
  /* Human Messages */
  'human-message.created': (body: HumanMessageCreatedEventDto) => void;

  /* Ai Messages */
  'ai-message.created': (body: AiMessageCreatedEventDto) => void;
  'ai-message.updated': (body: AiMessageUpdatedEventDto) => void;

  /* Environments */
  'environment.joined': (body: EnvironmentsRoomJoinedEventDto) => void;
};
