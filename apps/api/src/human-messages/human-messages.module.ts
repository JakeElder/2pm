import { Module } from '@nestjs/common';
import { HumanMessagesService } from './human-messages.service';
import { HumanMessagesController } from './human-messages.controller';
import { DatabaseModule } from '../database/database.module';
import { EnvironmentsGateway } from 'src/environments/environments.gateway';

@Module({
  imports: [DatabaseModule],
  controllers: [HumanMessagesController],
  providers: [HumanMessagesService, EnvironmentsGateway],
})
export class HumanMessagesModule {}
