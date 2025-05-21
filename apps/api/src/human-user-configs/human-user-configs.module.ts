import { Module } from '@nestjs/common';
import { HumanUserConfigsController } from './human-user-configs.controller';
import { DatabaseModule } from '../database/database.module';
import { HumanUserConfigsGateway } from './human-user-configs.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [HumanUserConfigsGateway],
  controllers: [HumanUserConfigsController],
})
export class HumanUserConfigsModule {}
