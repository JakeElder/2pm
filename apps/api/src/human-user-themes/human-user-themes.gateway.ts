import type {
  HumanUserThemesServerSocket,
  HumanUserThemesServer,
  HumanUserThemesRoomJoinedEventDto,
  HumanUserThemesRoomLeftEventDto,
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
  namespace: '/human-user-themes',
  cors: { origin: '*' },
})
export class HumanUserThemesGateway extends BaseGateway {
  private readonly logger = new Logger(HumanUserThemesGateway.name);

  @WebSocketServer()
  server: HumanUserThemesServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { humanUserId, humanUserThemeId }: HumanUserThemesRoomJoinedEventDto,
    @ConnectedSocket() socket: HumanUserThemesServerSocket,
  ) {
    if (socket.rooms.has(`${humanUserThemeId}`)) {
      return;
    }
    socket.join(`${humanUserThemeId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`joined: ${tag}`);
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody()
    { humanUserId, humanUserThemeId }: HumanUserThemesRoomLeftEventDto,
    @ConnectedSocket() socket: HumanUserThemesServerSocket,
  ) {
    if (!socket.rooms.has(`${humanUserThemeId}`)) {
      return;
    }
    socket.leave(`${humanUserThemeId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`left: ${tag}`);
  }
}
