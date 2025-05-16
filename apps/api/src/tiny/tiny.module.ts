import { Module } from '@nestjs/common';
import { TinyService } from './tiny.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TinyService],
  exports: [TinyService],
})
export class TinyModule {}
