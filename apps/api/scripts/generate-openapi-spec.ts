import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdir } from 'node:fs/promises';
import { AppModule } from '../src/app.module';

async function generateOpenApiSpec() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('2PM API')
    .setDescription('2PM API Documentation')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const dir = Bun.resolveSync(__dirname, '../generated');
  const file = `${dir}/openapi.json`;

  await mkdir(dir, { recursive: true });
  await Bun.write(file, JSON.stringify(document, null, 2));

  console.log('OpenAPI spec generated');
  await app.close();
}

generateOpenApiSpec().catch((err) =>
  console.error('Error generating OpenAPI spec:', err),
);
