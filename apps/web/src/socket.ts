import { EnvironmentsClientSocket, MessagesClientSocket } from "@2pm/data";
import { io } from "socket.io-client";

export const environmentsSocket: EnvironmentsClientSocket = io(
  "http://localhost:3002/environments",
);

export const messagesSocket: MessagesClientSocket = io(
  "http://localhost:3002/messages",
);
