import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { readFile } from 'node:fs/promises';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const specPath = resolve(__dirname, '../../generated/openapi.json');

  app.getHttpAdapter().get('/openapi.json', async (_, res) => {
    try {
      const content = await readFile(specPath, 'utf-8');
      res.type('application/json').send(content);
    } catch (error) {
      Logger.error('Error reading OpenAPI spec:', error.stack);
      res.status(500).send('Error reading OpenAPI spec');
    }
  });

  await app.listen(3003);
}

bootstrap();
