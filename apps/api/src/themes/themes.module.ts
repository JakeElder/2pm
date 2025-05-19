import { Module } from '@nestjs/common';
import { ThemesController } from './themes.controller';
import { DatabaseModule } from '../database/database.module';
import { ThemesGateway } from './themes.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [ThemesGateway],
  controllers: [ThemesController],
})
export class ThemesModule {}
