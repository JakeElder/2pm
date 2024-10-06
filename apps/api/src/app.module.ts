import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PlotPointsModule } from './plot-points/plot-points.module';
import { AiMessagesModule } from './ai-messages/ai-messages.module';
import { HumanMessagesModule } from './human-messages/human-messages.module';
import { CharacterEngineModule } from './character-engine/character-engine.module';
import { NarrativeService } from './narrative/narrative.service';
import { NarrativeModule } from './narrative/narrative.module';
import { PlotPointsGateway } from './plot-points/plot-points.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UsersModule,
    PlotPointsModule,
    AiMessagesModule,
    HumanMessagesModule,
    CharacterEngineModule,
    NarrativeModule,
  ],
  controllers: [AppController],
  providers: [AppService, NarrativeService, PlotPointsGateway],
})
export class AppModule {}
