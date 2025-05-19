import { Module } from '@nestjs/common';
import { UserSpaceListsController } from './user-space-lists.controller';
import { DatabaseModule } from '../database/database.module';
import { UserSpaceListsGateway } from './user-space-lists.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [UserSpaceListsGateway],
  controllers: [UserSpaceListsController],
})
export class UserSpaceListsModule {}
