import { Module } from '@nestjs/common';
import { AiUsersController } from './ai-users.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AiUsersController],
})
export class AiUsersModule {}
