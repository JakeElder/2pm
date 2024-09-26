import { Module } from '@nestjs/common';
import DBService from '@2pm/db';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'DB',
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        if (!dbUrl) {
          throw new Error('DATABASE_URL not set');
        }
        return new DBService(dbUrl);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule {}
