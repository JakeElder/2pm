import { PlotPointDto } from '@2pm/data/dtos';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/environments/:id/plot-points',
  cors: { origin: '*' },
})
export class PlotPointsGateway {
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
    this.server.to(`${environmentId}`).emit('create', plotPoint);
  }
}
