import { Module } from '@nestjs/common';
import { BibleVersesController } from './bible-verses.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BibleVersesController],
})
export class BibleVersesModule {}
