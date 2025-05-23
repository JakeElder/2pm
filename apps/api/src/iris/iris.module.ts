import { Module } from '@nestjs/common';
import { IrisService } from './iris.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [IrisService],
  exports: [IrisService],
})
export class IrisModule {}
