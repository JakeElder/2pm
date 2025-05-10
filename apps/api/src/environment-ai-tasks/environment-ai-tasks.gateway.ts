import type {
  EnvironmentAiTasksServerSocket,
  EnvironmentAiTasksServer,
  EnvironmentAiTasksRoomJoinedEventDto,
  EnvironmentAiTasksRoomLeftEventDto,
} from '@2pm/core';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject, Logger } from '@nestjs/common';
import { type DBService } from '@2pm/core/db';

@WebSocketGateway({
  namespace: '/environment-ai-tasks',
  cors: { origin: '*' },
})
export class EnvironmentAiTasksGateway {
  constructor(@Inject('DB') private readonly db: DBService) {}

  private readonly logger = new Logger(EnvironmentAiTasksGateway.name);

  @WebSocketServer()
  server: EnvironmentAiTasksServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { environmentId, humanUserId }: EnvironmentAiTasksRoomJoinedEventDto,
    @ConnectedSocket() socket: EnvironmentAiTasksServerSocket,
  ) {
    if (!socket.rooms.has(`${environmentId}`)) {
      const user = await this.db.core.humanUsers.find(humanUserId);

      if (!user) {
        return;
      }

      const name =
        user.type === 'ANONYMOUS'
          ? `@anon#${user.data.hash}`
          : `@${user.data.tag}`;

      socket.join(`${environmentId}`);
      this.logger.debug(`joined: ${name}`);
    }
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody()
    { environmentId, humanUserId }: EnvironmentAiTasksRoomLeftEventDto,
    @ConnectedSocket() socket: EnvironmentAiTasksServerSocket,
  ) {
    if (socket.rooms.has(`${environmentId}`)) {
      const user = await this.db.core.humanUsers.find(humanUserId);

      if (!user) {
        return;
      }

      const name =
        user.type === 'ANONYMOUS'
          ? `@anon#${user.data.hash}`
          : `@${user.data.tag}`;

      socket.leave(`${environmentId}`);
      this.logger.debug(`left: ${name}`);
    }
  }
}
