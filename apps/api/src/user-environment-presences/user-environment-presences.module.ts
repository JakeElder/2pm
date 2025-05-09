import { Module } from '@nestjs/common';
import { UserEnvironmentPresencesController } from './user-environment-presences.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserEnvironmentPresencesController],
})
export class UserEnvironmentPresencesModule {}
