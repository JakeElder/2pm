import type {
  ThemesServerSocket,
  ThemesServer,
  ThemesRoomJoinedEventDto,
  ThemesRoomLeftEventDto,
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
  namespace: '/themes',
  cors: { origin: '*' },
})
export class ThemesGateway extends BaseGateway {
  private readonly logger = new Logger(ThemesGateway.name);

  @WebSocketServer()
  server: ThemesServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { humanUserId, themeId }: ThemesRoomJoinedEventDto,
    @ConnectedSocket() socket: ThemesServerSocket,
  ) {
    if (socket.rooms.has(`${themeId}`)) {
      return;
    }
    socket.join(`${themeId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`joined: ${tag}`);
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody()
    { humanUserId, themeId }: ThemesRoomLeftEventDto,
    @ConnectedSocket() socket: ThemesServerSocket,
  ) {
    if (!socket.rooms.has(`${themeId}`)) {
      return;
    }
    socket.leave(`${themeId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`left: ${tag}`);
  }
}
