import type {
  UserSpaceListsServerSocket,
  UserSpaceListsServer,
  UserSpaceListsRoomJoinedEventDto,
  UserSpaceListsRoomLeftEventDto,
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
  namespace: '/user-space-lists',
  cors: { origin: '*' },
})
export class UserSpaceListsGateway extends BaseGateway {
  private readonly logger = new Logger(UserSpaceListsGateway.name);

  @WebSocketServer()
  server: UserSpaceListsServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { humanUserId }: UserSpaceListsRoomJoinedEventDto,
    @ConnectedSocket() socket: UserSpaceListsServerSocket,
  ) {
    if (socket.rooms.has('main')) {
      return;
    }
    socket.join('main');
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`joined: ${tag}`);
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody()
    { humanUserId }: UserSpaceListsRoomLeftEventDto,
    @ConnectedSocket() socket: UserSpaceListsServerSocket,
  ) {
    if (!socket.rooms.has('main')) {
      return;
    }
    socket.leave('main');
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`left: ${tag}`);
  }
}
