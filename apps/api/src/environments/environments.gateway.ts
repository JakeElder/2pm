import { PlotPointDto } from '@2pm/data/dtos';
import { EnvironmentRoomJoinedEvent } from '@2pm/data/events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/environments',
  cors: { origin: '*' },
})
export class EnvironmentsGateway {
  constructor(private events: EventEmitter2) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() { environment, user }: EnvironmentRoomJoinedEvent,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`${environment.id}`);
    this.events.emit('environment.joined', { environment, user });
  }

  sendPlotPointCreated({ environmentId, ...rest }: PlotPointDto) {
    this.server
      .to(`${environmentId}`)
      .emit('plot-point-created', { environmentId, ...rest });
  }
}
