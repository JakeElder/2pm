import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActorsModule } from './actors/actors.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SpecController } from './spec/spec.controller';
import { SpecService } from './spec/spec.service';

@Module({
  imports: [ActorsModule, PrismaModule, ConfigModule.forRoot()],
  controllers: [AppController, SpecController],
  providers: [AppService, PrismaService, SpecService],
})
export class AppModule {}
