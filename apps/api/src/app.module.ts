import { Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { ConfigModule } from '@nestjs/config';
import { ExpressAdapter } from '@bull-board/express';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from './event-emitter/event-emitter.module';
import { RedisModule } from './redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { SessionsModule } from './sessions/sessions.module';
import { AiMessagesModule } from './ai-messages/ai-messages.module';
import { HumanUsersModule } from './human-users/human-users.module';
import { WorldRoomEnvironmentsModule } from './world-room-environments/world-room-environments.module';
import { PlotPointsModule } from './plot-points/plot-points.module';
// import { EnvironmentGateway } from './environments/environments.gateway';
import { HumanMessagesModule } from './human-messages/human-messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule,
    RedisModule,
    DatabaseModule,
    BullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    SessionsModule,
    AiMessagesModule,
    HumanUsersModule,
    WorldRoomEnvironmentsModule,
    PlotPointsModule,
    HumanMessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService /* EnvironmentGateway */],
})
export class AppModule {}
