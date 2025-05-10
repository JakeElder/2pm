import type {
  SpaceListsServerSocket,
  SpaceListsServer,
  SpaceListsRoomJoinedEventDto,
  SpaceListsRoomLeftEventDto,
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
  namespace: '/space-lists',
  cors: { origin: '*' },
})
export class SpaceListsGateway {
  constructor(@Inject('DB') private readonly db: DBService) {}

  private readonly logger = new Logger(SpaceListsGateway.name);

  @WebSocketServer()
  server: SpaceListsServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { humanUserId }: SpaceListsRoomJoinedEventDto,
    @ConnectedSocket() socket: SpaceListsServerSocket,
  ) {
    if (!socket.rooms.has('main')) {
      const user = await this.db.core.humanUsers.find(humanUserId);

      if (!user) {
        return;
      }

      const name =
        user.type === 'ANONYMOUS'
          ? `@anon#${user.data.hash}`
          : `@${user.data.tag}`;

      socket.join('main');
      this.logger.debug(`joined: ${name}`);
    }
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody()
    { humanUserId }: SpaceListsRoomLeftEventDto,
    @ConnectedSocket() socket: SpaceListsServerSocket,
  ) {
    if (socket.rooms.has('main')) {
      const user = await this.db.core.humanUsers.find(humanUserId);

      if (!user) {
        return;
      }

      const name =
        user.type === 'ANONYMOUS'
          ? `@anon#${user.data.hash}`
          : `@${user.data.tag}`;

      socket.leave('main');
      this.logger.debug(`left: ${name}`);
    }
  }
}
