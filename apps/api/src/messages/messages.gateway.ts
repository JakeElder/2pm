import type {
  MessagesServerSocket,
  MessagesServer,
  MessageDto,
  MessagesRoomJoinedEventDto,
  MessagesRoomLeftEventDto,
} from '@2pm/data';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
  namespace: '/messages',
  cors: { origin: '*' },
})
export class MessagesGateway {
  constructor() {}
  private readonly logger = new Logger(MessagesGateway.name);

  @WebSocketServer()
  server: MessagesServer;

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() { messageId }: MessagesRoomJoinedEventDto,
    @ConnectedSocket() socket: MessagesServerSocket,
  ) {
    if (!socket.rooms.has(`${messageId}`)) {
      socket.join(`${messageId}`);
      this.logger.debug(`joined: ${socket.id}`);
    }
  }

  @SubscribeMessage('leave')
  handleLeaveRoom(
    @MessageBody() { messageId }: MessagesRoomLeftEventDto,
    @ConnectedSocket() socket: MessagesServerSocket,
  ) {
    if (socket.rooms.has(`${messageId}`)) {
      socket.leave(`${messageId}`);
      this.logger.debug(`left: ${socket.id}`);
    }
  }

  sendMessageUpdated(dto: MessageDto) {
    if (dto.type === 'AI_USER') {
      this.server.to(`${dto.message.id}`).emit('messages.ai.updated', dto);
    }
  }
}
