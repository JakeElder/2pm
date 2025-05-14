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
import { Inject, Logger } from '@nestjs/common';
import { DBService } from '@2pm/core/db';

@WebSocketGateway({
  namespace: '/ai-messages',
  cors: { origin: '*' },
})
export class AiMessagesGateway {
  constructor(@Inject('DB') private readonly db: DBService) {}

  private readonly logger = new Logger(AiMessagesGateway.name);

  @WebSocketServer()
  server: AiMessagesServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { aiMessageId, humanUserId }: AiMessagesRoomJoinedEventDto,
    @ConnectedSocket() socket: AiMessagesServerSocket,
  ) {
    if (!socket.rooms.has(`${aiMessageId}`)) {
      const user = await this.db.humanUsers.find(humanUserId);

      if (!user) {
        return;
      }

      const name =
        user.type === 'ANONYMOUS'
          ? `@anon#${user.data.hash}`
          : `@${user.data.tag}`;

      socket.join(`${aiMessageId}`);
      this.logger.debug(`joined: ${name}`);
    }
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody()
    { aiMessageId, humanUserId }: AiMessagesRoomLeftEventDto,
    @ConnectedSocket() socket: AiMessagesServerSocket,
  ) {
    if (socket.rooms.has(`${aiMessageId}`)) {
      const user = await this.db.humanUsers.find(humanUserId);

      if (!user) {
        return;
      }

      const name =
        user.type === 'ANONYMOUS'
          ? `@anon#${user.data.hash}`
          : `@${user.data.tag}`;

      socket.leave(`${aiMessageId}`);
      this.logger.debug(`left: ${name}`);
    }
  }
}
