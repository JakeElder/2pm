import type {
  AiMessagesServerSocket,
  AiMessagesServer,
  AiMessagesRoomJoinedEventDto,
  AiMessagesRoomLeftEventDto,
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
  namespace: '/ai-messages',
  cors: { origin: '*' },
})
export class AiMessagesGateway extends BaseGateway {
  private readonly logger = new Logger(AiMessagesGateway.name);

  @WebSocketServer()
  server: AiMessagesServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { aiMessageId, humanUserId }: AiMessagesRoomJoinedEventDto,
    @ConnectedSocket() socket: AiMessagesServerSocket,
  ) {
    if (socket.rooms.has(`${aiMessageId}`)) {
      return;
    }
    socket.join(`${aiMessageId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`joined: ${tag}`);
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody()
    { aiMessageId, humanUserId }: AiMessagesRoomLeftEventDto,
    @ConnectedSocket() socket: AiMessagesServerSocket,
  ) {
    if (!socket.rooms.has(`${aiMessageId}`)) {
      return;
    }
    socket.leave(`${aiMessageId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`left: ${tag}`);
  }
}
