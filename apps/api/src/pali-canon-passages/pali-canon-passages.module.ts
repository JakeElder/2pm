import { Module } from '@nestjs/common';
import { PaliCanonPassagesController } from './pali-canon-passages.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PaliCanonPassagesController],
})
export class PaliCanonPassagesModule {}
