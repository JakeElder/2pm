import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { AnonymousUsersController } from './anonymous-users.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController, AnonymousUsersController],
  providers: [UsersService],
})
export class UsersModule {}
