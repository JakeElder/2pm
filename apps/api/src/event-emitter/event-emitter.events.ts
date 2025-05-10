import {
  EnviromentAiTaskCompletedEventDto,
  EnviromentAiTaskUpdatedEventDto,
  EnvironmentsRoomJoinedEventDto,
  PlotPointDto,
  UserEnvironmentPresenceDto,
} from '@2pm/core';

export type AppEvents = {
  /* Plot Points */
  'plot-points.created': (body: PlotPointDto) => void;

  /* Environments */
  'environments.joined': (body: EnvironmentsRoomJoinedEventDto) => void;

  /* Ai Tasks */
  'environment-ai-tasks.updated': (
    body: EnviromentAiTaskUpdatedEventDto,
  ) => void;

  'environment-ai-tasks.completed': (
    body: EnviromentAiTaskCompletedEventDto,
  ) => void;

  /* User Environment Presences */
  'user-environment-presences.created': (
    body: UserEnvironmentPresenceDto,
  ) => void;
};
