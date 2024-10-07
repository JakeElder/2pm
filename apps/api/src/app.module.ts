import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PlotPointsModule } from './plot-points/plot-points.module';
import { AiMessagesModule } from './ai-messages/ai-messages.module';
import { HumanMessagesModule } from './human-messages/human-messages.module';
import { CharacterEngineModule } from './character-engine/character-engine.module';
import { EnvironmentModule } from './environment/environment.module';
import { PlotPointsGateway } from './plot-points/plot-points.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    EventEmitterModule.forRoot(),
    UsersModule,
    PlotPointsModule,
    AiMessagesModule,
    HumanMessagesModule,
    CharacterEngineModule,
    EnvironmentModule,
  ],
  controllers: [AppController],
  providers: [AppService, PlotPointsGateway],
})
export class AppModule {}
