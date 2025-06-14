import {
  AiMessagesClientSocket,
  EnvironmentAiTasksClientSocket,
  EnvironmentsClientSocket,
  EnvironmentUserListsClientSocket,
  HumanUserConfigsClientSocket,
  HumanUsersClientSocket,
  HumanUserThemesClientSocket,
  SpaceListsClientSocket,
  ThemesClientSocket,
} from "@2pm/core";
import { io } from "socket.io-client";

export const environmentsSocket: EnvironmentsClientSocket = io(
  `${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/environments`,
);

export const environmentAiTasksSocket: EnvironmentAiTasksClientSocket = io(
  `${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/environment-ai-tasks`,
);

export const spaceListsSocket: SpaceListsClientSocket = io(
  `${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/space-lists`,
);

export const environmentUserListsSocket: EnvironmentUserListsClientSocket = io(
  `${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/environment-user-lists`,
);

export const aiMessagesSocket: AiMessagesClientSocket = io(
  `${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/ai-messages`,
);

export const humanUserThemesSocket: HumanUserThemesClientSocket = io(
  `${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/human-user-themes`,
);

export const themesSocket: ThemesClientSocket = io(
  `${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/themes`,
);

export const humanUserConfigsSocket: HumanUserConfigsClientSocket = io(
  `${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/human-user-configs`,
);

export const humanUsersSocket: HumanUsersClientSocket = io(
  `${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/human-users`,
);
