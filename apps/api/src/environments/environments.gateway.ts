import { PlotPointDto } from '@2pm/schemas/dto';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/environments',
  cors: { origin: '*' },
})
export class EnvironmentsGateway {
  @WebSocketServer()
  server: Server;

  sendPlotPointUpdate(environmentId: number, plotPoint: PlotPointDto) {
    this.server
      .to(`${environmentId}/plot-points`)
      .emit('plot-point-added', plotPoint);
  }
}
