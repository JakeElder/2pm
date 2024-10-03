import { Environment } from '@2pm/schemas';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PlotPointDto } from 'src/plot-points/plot-point.dto';

@WebSocketGateway({
  namespace: '/environments',
  cors: { origin: '*' },
})
export class EnvironmentsGateway {
  @WebSocketServer()
  server: Server;

  sendPlotPointUpdate(
    environmentId: Environment['id'],
    plotPoint: PlotPointDto,
  ) {
    this.server
      .to(`${environmentId}/plot-points`)
      .emit('plot-point-added', plotPoint);
  }
}
