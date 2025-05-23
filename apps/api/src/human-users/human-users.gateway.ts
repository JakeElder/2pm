import type {
  HumanUsersServerSocket,
  HumanUsersServer,
  HumanUsersRoomJoinedEventDto,
  HumanUsersRoomLeftEventDto,
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
  namespace: '/human-users',
  cors: { origin: '*' },
})
export class HumanUsersGateway extends BaseGateway {
  private readonly logger = new Logger(HumanUsersGateway.name);

  @WebSocketServer()
  server: HumanUsersServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { humanUserId }: HumanUsersRoomJoinedEventDto,
    @ConnectedSocket() socket: HumanUsersServerSocket,
  ) {
    if (socket.rooms.has(`${humanUserId}`)) {
      return;
    }
    socket.join(`${humanUserId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`joined: ${tag}`);
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody()
    { humanUserId }: HumanUsersRoomLeftEventDto,
    @ConnectedSocket() socket: HumanUsersServerSocket,
  ) {
    if (!socket.rooms.has(`${humanUserId}`)) {
      return;
    }
    socket.leave(`${humanUserId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`left: ${tag}`);
  }
}
