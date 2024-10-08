import { PlotPointDto } from '@2pm/data/dtos';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppEventEmitter } from '../event-emitter';
import { Inject } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/environments',
  cors: { origin: '*' },
})
export class EnvironmentsGateway {
  constructor(@Inject('E') private events: AppEventEmitter) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() { environment, user }: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`${environment.id}`);
    this.events.emit('environment.joined', { environment, user });
  }

  sendPlotPointCreated({ environmentId, ...rest }: PlotPointDto) {
    this.server
      .to(`${environmentId}`)
      .emit('plot-point.created', { environmentId, ...rest });
  }
}
