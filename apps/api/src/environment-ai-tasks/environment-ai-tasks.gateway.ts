import type {
  EnvironmentAiTasksServerSocket,
  EnvironmentAiTasksServer,
  EnvironmentAiTasksRoomJoinedEventDto,
  EnvironmentAiTasksRoomLeftEventDto,
} from '@2pm/core';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { BaseGateway } from 'src/base-gateway/base-gateway-service';

@WebSocketGateway({
  namespace: '/environment-ai-tasks',
  cors: { origin: '*' },
})
export class EnvironmentAiTasksGateway extends BaseGateway {
  private readonly logger = new Logger(EnvironmentAiTasksGateway.name);

  @WebSocketServer()
  server: EnvironmentAiTasksServer;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody()
    { environmentId, humanUserId }: EnvironmentAiTasksRoomJoinedEventDto,
    @ConnectedSocket() socket: EnvironmentAiTasksServerSocket,
  ) {
    if (socket.rooms.has(`${environmentId}`)) {
      return;
    }
    socket.join(`${environmentId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`joined: ${tag}`);
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(
    @MessageBody()
    { environmentId, humanUserId }: EnvironmentAiTasksRoomLeftEventDto,
    @ConnectedSocket() socket: EnvironmentAiTasksServerSocket,
  ) {
    if (!socket.rooms.has(`${environmentId}`)) {
      return;
    }
    socket.leave(`${environmentId}`);
    const tag = await this.getUserTag(humanUserId);
    this.logger.debug(`left: ${tag}`);
  }
}
