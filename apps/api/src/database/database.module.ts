import { Module } from '@nestjs/common';
import { DBService } from '@2pm/core/db';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: 'DB',
      useFactory: (config: ConfigService): DBService => {
        const appDatabaseUrl = config.get<string>('APP_DATABASE_URL');
        const libraryDatabaseUrl = config.get<string>('LIBRARY_DATABASE_URL');

        if (!appDatabaseUrl) {
          throw new Error('APP_DATABASE_URL not set');
        }

        if (!libraryDatabaseUrl) {
          throw new Error('LIBRARY_DATABASE_URL not set');
        }

        return new DBService({ appDatabaseUrl, libraryDatabaseUrl });
      },
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule {}
