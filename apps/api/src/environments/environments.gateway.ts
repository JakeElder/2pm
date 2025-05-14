import type {
  EnvironmentsServerSocket,
  EnvironmentsServer,
  EnvironmentsRoomJoinedEventDto,
  EnvironmentsRoomLeftEventDto,
} from '@2pm/core';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject, Logger } from '@nestjs/common';
import { AppEventEmitter } from '../event-emitter';
import { DBService } from '@2pm/core/db';

@WebSocketGateway({
  namespace: '/environments',
  cors: { origin: '*' },
})
export class EnvironmentsGateway {
  constructor(
    @Inject('E') private events: AppEventEmitter,
    @Inject('DB') private readonly db: DBService,
  ) {}
  private readonly logger = new Logger(EnvironmentsGateway.name);

  @WebSocketServer()
  server: EnvironmentsServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { environmentId, humanUserId }: EnvironmentsRoomJoinedEventDto,
    @ConnectedSocket() socket: EnvironmentsServerSocket,
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

      this.logger.debug(`joined: ${name}`);
      socket.join(`${environmentId}`);
      this.events.emit('environments.joined', { environmentId, humanUserId });
    }
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody() { environmentId, humanUserId }: EnvironmentsRoomLeftEventDto,
    @ConnectedSocket() socket: EnvironmentsServerSocket,
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
