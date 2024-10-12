import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CharacterEngineModule } from './character-engine/character-engine.module';
import { EnvironmentModule } from './environments/environments.module';
import { EnvironmentsGateway } from './environments/environments.gateway';
import { HydratedPlotPointsModule } from './hydrated-plot-points/hydrated-plot-points.module';
import { EventEmitterModule } from './event-emitter/event-emitter.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CharacterEngineModule,
    EnvironmentModule,
    HydratedPlotPointsModule,
    EventEmitterModule,
    UsersModule,
    MessagesModule,
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EnvironmentsGateway],
})
export class AppModule {}
