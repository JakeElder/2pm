import { EnvironmentsRoomJoinedEventDto, PlotPointDto } from '@2pm/core';

export type AppEvents = {
  /* Plot Points */
  'plot-points.created': (body: PlotPointDto) => void;

  /* Environments */
  'environments.joined': (body: EnvironmentsRoomJoinedEventDto) => void;
};
