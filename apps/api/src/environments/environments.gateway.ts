import type {
  EnvironmentsServerSocket,
  EnvironmentsServer,
  PlotPointDto,
  EnvironmentsRoomJoinedEventDto,
  EnvironmentsRoomLeftEventDto,
} from '@2pm/data';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject, Logger } from '@nestjs/common';
import { AppEventEmitter } from '../event-emitter';

@WebSocketGateway({
  namespace: '/environments',
  cors: { origin: '*' },
})
export class EnvironmentGateway {
  constructor(@Inject('E') private events: AppEventEmitter) {}
  private readonly logger = new Logger(EnvironmentGateway.name);

  @WebSocketServer()
  server: EnvironmentsServer;

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() { environment, user }: EnvironmentsRoomJoinedEventDto,
    @ConnectedSocket() socket: EnvironmentsServerSocket,
  ) {
    if (!socket.rooms.has(`${environment.id}`)) {
      socket.join(`${environment.id}`);
      this.logger.debug(`joined: ${socket.id}`);
      this.events.emit('environments.joined', { environment, user });
    }
  }

  @SubscribeMessage('leave')
  handleLeaveRoom(
    @MessageBody() { environment }: EnvironmentsRoomLeftEventDto,
    @ConnectedSocket() socket: EnvironmentsServerSocket,
  ) {
    if (socket.rooms.has(`${environment.id}`)) {
      socket.leave(`${environment.id}`);
      this.logger.debug(`left: ${socket.id}`);
    }
  }

  sendPlotPointCreatedEvent(dto: PlotPointDto) {
    this.server
      .to(`${dto.data.environment.id}`)
      .emit('plot-points.created', dto);
  }
}
