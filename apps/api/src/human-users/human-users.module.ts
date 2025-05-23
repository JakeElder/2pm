import { Module } from '@nestjs/common';
import { HumanUsersController } from './human-users.controller';
import { DatabaseModule } from '../database/database.module';
import { HumanUsersGateway } from './human-users.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [HumanUsersGateway],
  controllers: [HumanUsersController],
})
export class HumanUsersModule {}
