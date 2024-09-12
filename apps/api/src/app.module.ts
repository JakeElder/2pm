import { Module } from '@nestjs/common';
import * as schema from '@2pm/schemas/drizzle';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActorsModule } from './actors/actors.module';
import { ConfigModule } from '@nestjs/config';
import { SpecController } from './spec/spec.controller';
import { SpecService } from './spec/spec.service';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';

@Module({
  imports: [
    ActorsModule,
    ConfigModule.forRoot(),
    DrizzlePostgresModule.register({
      tag: 'DB',
      postgres: { url: process.env.DATABASE_URL },
      config: { schema: { ...schema } },
    }),
  ],
  controllers: [AppController, SpecController],
  providers: [AppService, SpecService],
})
export class AppModule {}
