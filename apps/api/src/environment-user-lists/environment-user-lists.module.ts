import { Module } from '@nestjs/common';
import { EnvironmentUserListsController } from './environment-user-lists.controller';
import { DatabaseModule } from '../database/database.module';
import { EnvironmentUserListsGateway } from './environment-user-lists.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [EnvironmentUserListsGateway],
  controllers: [EnvironmentUserListsController],
})
export class EnvironmentUserListsModule {}
