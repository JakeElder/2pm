import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';

async function generateOpenApiSpec() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('2PM API')
    .setDescription('2PM API Documentation')
    .addServer('http://localhost:3003')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const file = `./generated/openapi.json`;
  await Bun.write(file, JSON.stringify(document, null, 2));

  Logger.log('✅ OpenAPI spec generated');
  await app.close();
}

generateOpenApiSpec().catch((err) => {
  Logger.error('Error generating OpenAPI spec', err.stack);
});
