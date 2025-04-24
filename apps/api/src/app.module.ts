import { Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { ConfigModule } from '@nestjs/config';
import { ExpressAdapter } from '@bull-board/express';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { EnvironmentGateway } from './environments/environments.gateway';
import { EventEmitterModule } from './event-emitter/event-emitter.module';
import { RedisModule } from './redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { SessionsModule } from './sessions/sessions.module';
// import { EnvironmentModule } from './environments/environments.module';
// import { PlotPointsModule } from './plot-points/plot-points.module';
// import { UsersModule } from './users/users.module';
// import { MessagesModule } from './messages/messages.module';
import { AiMessagesController } from './ai-messages/ai-messages.controller';
import { AiMessagesModule } from './ai-messages/ai-messages.module';

@Module({
  imports: [
    SessionsModule,
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
    AiMessagesModule,
    // EnvironmentModule,
    // PlotPointsModule,
    // UsersModule,
    // MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService /* EnvironmentGateway */],
})
export class AppModule {}
