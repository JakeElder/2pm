import { Module } from '@nestjs/common';
import { HumanMessagesService } from './human-messages.service';
import { HumanMessagesController } from './human-messages.controller';
import { DatabaseModule } from '../database/database.module';
import { EnvironmentsGateway } from '../environments/environments.gateway';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { EnvironmentModule } from '../environments/environments.module';

@Module({
  imports: [DatabaseModule, CharacterEngineModule, EnvironmentModule],
  controllers: [HumanMessagesController],
  providers: [HumanMessagesService, EnvironmentsGateway],
})
export class HumanMessagesModule {}
