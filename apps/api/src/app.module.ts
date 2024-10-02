import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PlotPointsModule } from './plot-points/plot-points.module';
import { AiMessagesModule } from './ai-messages/ai-messages.module';
import { HumanMessagesModule } from './human-messages/human-messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UsersModule,
    PlotPointsModule,
    AiMessagesModule,
    HumanMessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
