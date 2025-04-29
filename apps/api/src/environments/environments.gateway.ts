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

@WebSocketGateway({
  namespace: '/environments',
  cors: { origin: '*' },
})
export class EnvironmentGateway {
  constructor(@Inject('E') private events: AppEventEmitter) {}
  private readonly logger = new Logger(EnvironmentGateway.name);

  @WebSocketServer()
  server: EnvironmentsServer;

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() { environmentId, userId }: EnvironmentsRoomJoinedEventDto,
    @ConnectedSocket() socket: EnvironmentsServerSocket,
  ) {
    if (!socket.rooms.has(`${environmentId}`)) {
      socket.join(`${environmentId}`);
      this.logger.debug(`joined: ${socket.id}`);
      this.events.emit('environments.joined', { environmentId, userId });
    }
  }

  @SubscribeMessage('leave')
  handleLeaveRoom(
    @MessageBody() { environmentId }: EnvironmentsRoomLeftEventDto,
    @ConnectedSocket() socket: EnvironmentsServerSocket,
  ) {
    if (socket.rooms.has(`${environmentId}`)) {
      socket.leave(`${environmentId}`);
      this.logger.debug(`left: ${socket.id}`);
    }
  }
}
