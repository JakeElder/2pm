import {
  EnvironmentsRoomJoinedEventDto,
  MessageDto,
  PlotPointDto,
} from '@2pm/data';

export type AppEvents = {
  /* Plot Points */
  'plot-points.created': (body: PlotPointDto) => void;

  /* Messages */
  'messages.updated': (body: MessageDto) => void;

  /* Environments */
  'environments.joined': (body: EnvironmentsRoomJoinedEventDto) => void;
};
