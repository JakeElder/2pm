import { EnvironmentsClientSocket } from "@2pm/core";
import { io } from "socket.io-client";

export const environmentsSocket: EnvironmentsClientSocket = io(
  `${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/environments`,
);
