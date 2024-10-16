import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { DatabaseModule } from '../database/database.module';
import { AnonymousSessionsController } from './anonymous-sessions.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SessionsController, AnonymousSessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
