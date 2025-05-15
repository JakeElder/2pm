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
import { Logger } from '@nestjs/common';
import { BaseGateway } from '../base-gateway/base-gateway-service';

@WebSocketGateway({
  namespace: '/space-lists',
  cors: { origin: '*' },
})
export class SpaceListsGateway extends BaseGateway {
  private readonly logger = new Logger(SpaceListsGateway.name);

  @WebSocketServer()
  server: SpaceListsServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { humanUserId }: SpaceListsRoomJoinedEventDto,
    @ConnectedSocket() socket: SpaceListsServerSocket,
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
    { humanUserId }: SpaceListsRoomLeftEventDto,
    @ConnectedSocket() socket: SpaceListsServerSocket,
  ) {
    if (!socket.rooms.has('main')) {
      return;
    }
    socket.leave('main');
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`left: ${tag}`);
  }
}
