import type {
  HumanMessageCreatedEvent,
  EnvironmentRoomJoinedEvent,
  AiMessageCreatedEvent,
} from '@2pm/data/api-events';

export type AppEvents = {
  /* Human Messages */
  'human-message.created': (body: HumanMessageCreatedEvent) => void;

  /* Ai Messages */
  'ai-message.created': (body: AiMessageCreatedEvent) => void;

  /* Environments */
  'environment.joined': (body: EnvironmentRoomJoinedEvent) => void;
};
