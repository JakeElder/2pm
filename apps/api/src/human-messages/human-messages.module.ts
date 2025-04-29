import { Module } from '@nestjs/common';
import { HumanMessagesController } from './human-messages.controller';
import { DatabaseModule } from '../database/database.module';
import { EnvironmentsModule } from 'src/environments/environments.module';

@Module({
  imports: [DatabaseModule, EnvironmentsModule],
  controllers: [HumanMessagesController],
})
export class HumanMessagesModule {}
