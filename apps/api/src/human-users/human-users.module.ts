import { Module } from '@nestjs/common';
import { HumanUsersController } from './human-users.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HumanUsersController],
})
export class HumanUsersModule {}
