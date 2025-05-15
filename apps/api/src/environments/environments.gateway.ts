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
import { Logger } from '@nestjs/common';
import { BaseGateway } from '../base-gateway/base-gateway-service';

@WebSocketGateway({
  namespace: '/environments',
  cors: { origin: '*' },
})
export class EnvironmentsGateway extends BaseGateway {
  private readonly logger = new Logger(EnvironmentsGateway.name);

  @WebSocketServer()
  server: EnvironmentsServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { environmentId, humanUserId }: EnvironmentsRoomJoinedEventDto,
    @ConnectedSocket() socket: EnvironmentsServerSocket,
  ) {
    if (socket.rooms.has(`${environmentId}`)) {
      return;
    }
    socket.join(`${environmentId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`joined: ${tag}`);
    this.events.emit('environments.joined', { environmentId, humanUserId });
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody() { environmentId, humanUserId }: EnvironmentsRoomLeftEventDto,
    @ConnectedSocket() socket: EnvironmentsServerSocket,
  ) {
    if (!socket.rooms.has(`${environmentId}`)) {
      return;
    }
    socket.leave(`${environmentId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`left: ${tag}`);
  }
}
