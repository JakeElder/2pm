import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PlotPointsModule } from './plot-points/plot-points.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UsersModule,
    PlotPointsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
