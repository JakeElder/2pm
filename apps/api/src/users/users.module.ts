import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { HumanUsersController } from './human-users.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController, HumanUsersController],
  providers: [],
})
export class UsersModule {}
