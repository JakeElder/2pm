import { Module } from '@nestjs/common';
import { AppDBService } from '@2pm/core/db';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: 'DB',
      useFactory: (config: ConfigService) => {
        const appDatabaseUrl = config.get<string>('APP_DATABASE_URL');
        const libraryDatabaseUrl = config.get<string>('LIBRARY_DATABASE_URL');

        if (!appDatabaseUrl) {
          throw new Error('APP_DATABASE_URL not set');
        }

        if (!libraryDatabaseUrl) {
          throw new Error('LIBRARY_DATABASE_URL not set');
        }

        return {
          app: new AppDBService(appDatabaseUrl),
        };
      },
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule {}
