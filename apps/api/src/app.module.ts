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

import { AiMessagesModule } from './ai-messages/ai-messages.module';
import { AiUsersModule } from './ai-users/ai-users.module';
import { BibleVersesModule } from './bible-verses/bible-verses.module';
import { EnvironmentAiTasksModule } from './environment-ai-tasks/environment-ai-tasks.module';
import { EnvironmentUserListsModule } from './environment-user-lists/environment-user-lists.module';
import { HumanMessagesModule } from './human-messages/human-messages.module';
import { HumanUserRoomEnvironmentsModule } from './human-user-room-environments/human-user-room-environments.module';
import { HumanUserThemesModule } from './human-user-themes/human-user-themes.module';
import { HumanUsersModule } from './human-users/human-users.module';
import { NikoModule } from './niko/niko.module';
import { PaliCanonPassagesModule } from './pali-canon-passages/pali-canon-passages.module';
import { PlotPointsModule } from './plot-points/plot-points.module';
import { SessionsModule } from './sessions/sessions.module';
import { SpaceListsModule } from './space-lists/space-lists.module';
import { TinyModule } from './tiny/tiny.module';
import { UserEnvironmentPresencesModule } from './user-environment-presences/user-environment-presences.module';
import { UserSpaceListsModule } from './user-space-lists/user-space-lists.module';
import { UsersModule } from './users/users.module';
import { WorldRoomEnvironmentsModule } from './world-room-environments/world-room-environments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    EventEmitterModule,
    RedisModule,
    DatabaseModule,

    AiMessagesModule,
    AiUsersModule,
    BibleVersesModule,
    EnvironmentAiTasksModule,
    EnvironmentUserListsModule,
    HumanMessagesModule,
    HumanUserRoomEnvironmentsModule,
    HumanUserThemesModule,
    HumanUsersModule,
    NikoModule,
    PaliCanonPassagesModule,
    PlotPointsModule,
    SessionsModule,
    SessionsModule,
    SpaceListsModule,
    TinyModule,
    UserEnvironmentPresencesModule,
    UserSpaceListsModule,
    UsersModule,
    WorldRoomEnvironmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
