import type {
  HumanUserConfigsServerSocket,
  HumanUserConfigsServer,
  HumanUserConfigsRoomJoinedEventDto,
  HumanUserConfigsRoomLeftEventDto,
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
  namespace: '/human-user-configs',
  cors: { origin: '*' },
})
export class HumanUserConfigsGateway extends BaseGateway {
  private readonly logger = new Logger(HumanUserConfigsGateway.name);

  @WebSocketServer()
  server: HumanUserConfigsServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { humanUserId }: HumanUserConfigsRoomJoinedEventDto,
    @ConnectedSocket() socket: HumanUserConfigsServerSocket,
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
    { humanUserId }: HumanUserConfigsRoomLeftEventDto,
    @ConnectedSocket() socket: HumanUserConfigsServerSocket,
  ) {
    if (!socket.rooms.has(`${humanUserId}`)) {
      return;
    }
    socket.leave(`${humanUserId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`left: ${tag}`);
  }
}
