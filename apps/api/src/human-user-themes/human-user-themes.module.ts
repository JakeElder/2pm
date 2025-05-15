import { Module } from '@nestjs/common';
import { HumanUserThemesController } from './human-user-themes.controller';
import { DatabaseModule } from '../database/database.module';
import { HumanUserThemesGateway } from './human-user-themes.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [HumanUserThemesGateway],
  controllers: [HumanUserThemesController],
})
export class HumanUserThemesModule {}
