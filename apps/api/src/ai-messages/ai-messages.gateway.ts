import type {
  AiMessagesServerSocket,
  AiMessagesServer,
  AiMessageDto,
  AiMessagesRoomJoinedEventDto,
} from '@2pm/data';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
  namespace: '/ai-messages',
  cors: { origin: '*' },
})
export class AiMessagesGateway {
  constructor() {}

  @WebSocketServer()
  server: AiMessagesServer;

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() { aiMessageId }: AiMessagesRoomJoinedEventDto,
    @ConnectedSocket() socket: AiMessagesServerSocket,
  ) {
    socket.join(`${aiMessageId}`);
  }

  sendAiMessageUpdated(dto: AiMessageDto) {
    this.server.to(`${dto.id}`).emit('ai-messages.updated', dto);
  }
}
