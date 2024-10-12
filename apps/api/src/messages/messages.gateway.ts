import type {
  MessagesServerSocket,
  MessagesServer,
  MessageDto,
  MessagesRoomJoinedEventDto,
} from '@2pm/data';
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

  @WebSocketServer()
  server: MessagesServer;

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() { messageId }: MessagesRoomJoinedEventDto,
    @ConnectedSocket() socket: MessagesServerSocket,
  ) {
    socket.join(`${messageId}`);
  }

  sendMessageUpdated(dto: MessageDto) {
    if (dto.type === 'AI') {
      this.server.to(`${dto.message.id}`).emit('messages.ai.updated', dto);
    }
  }
}
