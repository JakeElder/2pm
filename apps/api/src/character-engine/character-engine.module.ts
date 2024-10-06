import CharacterEngine from '@2pm/character-engine';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'CE',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('OLLAMA_HOST');
        if (!host) {
          throw new Error('OLLAMA_HOST not set');
        }
        return new CharacterEngine(host);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['CE'],
})
export class CharacterEngineModule {}
