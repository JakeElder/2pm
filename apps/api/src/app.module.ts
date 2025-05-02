import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from './event-emitter/event-emitter.module';
import { RedisModule } from './redis/redis.module';
import { DatabaseModule } from './database/database.module';

import { AiMessagesModule } from './ai-messages/ai-messages.module';
import { EnvironmentGateway } from './environments/environments.gateway';
import { HumanMessagesModule } from './human-messages/human-messages.module';
import { HumanUsersModule } from './human-users/human-users.module';
import { PlotPointsModule } from './plot-points/plot-points.module';
import { SessionsModule } from './sessions/sessions.module';
import { UsersModule } from './users/users.module';
import { WorldRoomEnvironmentsModule } from './world-room-environments/world-room-environments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule,
    RedisModule,
    DatabaseModule,
    AiMessagesModule,
    HumanMessagesModule,
    HumanUsersModule,
    PlotPointsModule,
    SessionsModule,
    UsersModule,
    WorldRoomEnvironmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EnvironmentGateway],
})
export class AppModule {}
