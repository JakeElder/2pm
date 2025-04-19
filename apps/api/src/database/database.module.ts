import { Module } from '@nestjs/common';
import { DBService } from '@2pm/core/db';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: 'DB',
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        if (!dbUrl) {
          throw new Error('DATABASE_URL not set');
        }
        return new DBService(dbUrl);
      },
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule {}
