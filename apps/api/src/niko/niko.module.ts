import { Module } from '@nestjs/common';
import { NikoService } from './niko.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [NikoService],
  exports: [NikoService],
})
export class NikoModule {}
