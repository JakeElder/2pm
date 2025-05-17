import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
