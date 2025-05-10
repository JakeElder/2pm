import { Module } from '@nestjs/common';
import { SpaceListsController } from './space-lists.controller';
import { DatabaseModule } from '../database/database.module';
import { SpaceListsGateway } from './space-lists.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [SpaceListsGateway],
  controllers: [SpaceListsController],
})
export class SpaceListsModule {}
