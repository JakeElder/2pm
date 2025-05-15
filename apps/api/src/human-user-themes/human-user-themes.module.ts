import { Module } from '@nestjs/common';
import { HumanUserThemesController } from './human-user-themes.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HumanUserThemesController],
})
export class HumanUserThemesModule {}
