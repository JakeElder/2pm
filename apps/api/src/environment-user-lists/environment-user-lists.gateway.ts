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
import { Logger } from '@nestjs/common';
import { BaseGateway } from '../base-gateway/base-gateway-service';

@WebSocketGateway({
  namespace: '/environment-user-lists',
  cors: { origin: '*' },
})
export class EnvironmentUserListsGateway extends BaseGateway {
  private readonly logger = new Logger(EnvironmentUserListsGateway.name);

  @WebSocketServer()
  server: EnvironmentUserListsServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { environmentId, humanUserId }: EnvironmentUserListsRoomJoinedEventDto,
    @ConnectedSocket() socket: EnvironmentUserListsServerSocket,
  ) {
    if (socket.rooms.has(`${environmentId}`)) {
      return;
    }
    const tag = await this.getUserTag(humanUserId);
    socket.join(`${environmentId}`);
    this.logger.debug(`joined: ${tag}`);
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody()
    { environmentId, humanUserId }: EnvironmentUserListsRoomLeftEventDto,
    @ConnectedSocket() socket: EnvironmentUserListsServerSocket,
  ) {
    if (!socket.rooms.has(`${environmentId}`)) {
      return;
    }
    socket.leave(`${environmentId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`left: ${tag}`);
  }
}
