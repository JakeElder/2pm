import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
