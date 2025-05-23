import { Module } from '@nestjs/common';
import { WhyService } from './why.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [WhyService],
  exports: [WhyService],
})
export class WhyModule {}
