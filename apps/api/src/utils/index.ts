import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../app.module';

export async function generateSpecDocument(server?: string) {
  const app = await NestFactory.create(AppModule, { logger: false });

  const document = SwaggerModule.createDocument(app, {
    openapi: '3.0.0',
    info: { title: '2PM API', version: '1.0.0' },
    servers: server ? [{ url: server }] : [],
  });

  await app.close();

  return document;
}
