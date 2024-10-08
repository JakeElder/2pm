import type {
  EnvironmentsServerSocket,
  EnvironmentsServer,
  HydratedPlotPoint,
  EnvironmentsRoomJoinedEventDto,
} from '@2pm/data';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { AppEventEmitter } from '../event-emitter';

@WebSocketGateway({
  namespace: '/environments',
  cors: { origin: '*' },
})
export class EnvironmentsGateway {
  constructor(@Inject('E') private events: AppEventEmitter) {}

  @WebSocketServer()
  server: EnvironmentsServer;

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() { environment, user }: EnvironmentsRoomJoinedEventDto,
    @ConnectedSocket() socket: EnvironmentsServerSocket,
  ) {
    socket.join(`${environment.id}`);
    this.events.emit('environment.joined', { environment, user });
  }

  sendPlotPointCreated(dto: HydratedPlotPoint) {
    this.server.to(`${dto.environmentId}`).emit('plot-point.created', dto);
  }
}
