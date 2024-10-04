import { PlotPointDto } from '@2pm/schemas/dto';
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
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
  }

  sendPlotPointUpdate(environmentId: number, plotPoint: PlotPointDto) {
    this.server
      .to(`${environmentId}/plot-points`)
      .emit('plot-point-added', plotPoint);
  }
}
