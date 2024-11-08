import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../app.module';
import ErrorStackParser from 'error-stack-parser';
import chalk from 'chalk';
import path from 'path';

export function logError(logger: Logger, exception: any) {
  const header = `Exception: "${exception.message}"`;
  logger.error(chalk.bgBlack(chalk.white(header)));
  const stack = ErrorStackParser.parse(exception);
  for (const step of stack) {
    const { fileName, lineNumber } = step;
    const relativePath = path.relative(process.cwd(), fileName || '');
    logger.error(chalk.white(`${relativePath}:${lineNumber}`));
  }
}

export async function generateSpecDocument(server?: string) {
  const app = await NestFactory.create(AppModule, {
    logger: ['error'],
  });

  const document = SwaggerModule.createDocument(app, {
    openapi: '3.0.0',
    info: { title: '2PM API', version: '1.0.0' },
    servers: server ? [{ url: server }] : [],
  });

  await app.close();

  return document;
}
