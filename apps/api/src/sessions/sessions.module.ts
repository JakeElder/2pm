import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SessionsController],
  providers: [],
})
export class SessionsModule {}
