import { Module } from '@nestjs/common';
import { CoreDBService } from '@2pm/core/db';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: 'DB',
      useFactory: (config: ConfigService) => {
        const coreDatabaseUrl = config.get<string>('CORE_DATABASE_URL');
        const libraryDatabaseUrl = config.get<string>('LIBRARY_DATABASE_URL');

        if (!coreDatabaseUrl) {
          throw new Error('CORE_DATABASE_URL not set');
        }

        if (!libraryDatabaseUrl) {
          throw new Error('LIBRARY_DATABASE_URL not set');
        }

        return {
          core: new CoreDBService(coreDatabaseUrl),
        };
      },
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule {}
