import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PlotPointsModule } from './plot-points/plot-points.module';
import { AiMessagesModule } from './ai-messages/ai-messages.module';
import { HumanMessagesModule } from './human-messages/human-messages.module';
import { CharacterEngineModule } from './character-engine/character-engine.module';
import { EnvironmentModule } from './environments/environments.module';
import { EnvironmentsGateway } from './environments/environments.gateway';
import { HydratedPlotPointsModule } from './hydrated-plot-points/hydrated-plot-points.module';
import { EventEmitterModule } from './event-emitter/event-emitter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UsersModule,
    PlotPointsModule,
    AiMessagesModule,
    HumanMessagesModule,
    CharacterEngineModule,
    EnvironmentModule,
    HydratedPlotPointsModule,
    EventEmitterModule,
  ],
  controllers: [AppController],
  providers: [AppService, EnvironmentsGateway],
})
export class AppModule {}
