import type {
  EnvironmentsServerSocket,
  EnvironmentsServer,
  HydratedPlotPointDto,
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
export class EnvironmentGateway {
  constructor(@Inject('E') private events: AppEventEmitter) {}

  @WebSocketServer()
  server: EnvironmentsServer;

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() { environment, user }: EnvironmentsRoomJoinedEventDto,
    @ConnectedSocket() socket: EnvironmentsServerSocket,
  ) {
    socket.join(`${environment.id}`);
    this.events.emit('environments.joined', { environment, user });
  }

  sendPlotPointCreated(dto: HydratedPlotPointDto) {
    this.server
      .to(`${dto.data.environment.id}`)
      .emit('plot-points.created', dto);
  }
}
