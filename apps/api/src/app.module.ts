import { Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterEngineModule } from './character-engine/character-engine.module';
import { EnvironmentModule } from './environments/environments.module';
import { EnvironmentGateway } from './environments/environments.gateway';
import { PlotPointsModule } from './plot-points/plot-points.module';
import { EventEmitterModule } from './event-emitter/event-emitter.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { RedisModule } from './redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CharacterEngineModule,
    EnvironmentModule,
    PlotPointsModule,
    EventEmitterModule,
    RedisModule,
    DatabaseModule,
    UsersModule,
    MessagesModule,
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EnvironmentGateway],
})
export class AppModule {}
