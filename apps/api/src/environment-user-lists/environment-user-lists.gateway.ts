import type {
  EnvironmentUserListsServerSocket,
  EnvironmentUserListsServer,
  EnvironmentUserListsRoomJoinedEventDto,
  EnvironmentUserListsRoomLeftEventDto,
} from '@2pm/core';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject, Logger } from '@nestjs/common';
import { DBService } from '@2pm/core/db';

@WebSocketGateway({
  namespace: '/environment-user-lists',
  cors: { origin: '*' },
})
export class EnvironmentUserListsGateway {
  constructor(@Inject('DB') private readonly db: DBService) {}

  private readonly logger = new Logger(EnvironmentUserListsGateway.name);

  @WebSocketServer()
  server: EnvironmentUserListsServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { environmentId, humanUserId }: EnvironmentUserListsRoomJoinedEventDto,
    @ConnectedSocket() socket: EnvironmentUserListsServerSocket,
  ) {
    if (!socket.rooms.has(`${environmentId}`)) {
      const user = await this.db.humanUsers.find(humanUserId);

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
    { environmentId, humanUserId }: EnvironmentUserListsRoomLeftEventDto,
    @ConnectedSocket() socket: EnvironmentUserListsServerSocket,
  ) {
    if (socket.rooms.has(`${environmentId}`)) {
      const user = await this.db.humanUsers.find(humanUserId);

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
