import { EnvironmentsRoomJoinedEventDto, MessageDto } from '@2pm/data';

export type AppEvents = {
  /* Messages */
  'messages.created': (body: MessageDto) => void;
  'messages.updated': (body: MessageDto) => void;

  /* Environments */
  'environments.joined': (body: EnvironmentsRoomJoinedEventDto) => void;
};
