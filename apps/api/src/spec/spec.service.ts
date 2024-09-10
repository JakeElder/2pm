import { Injectable } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
import { readFile } from 'node:fs/promises';
import { Logger } from '@nestjs/common';
import { resolve } from 'path';

@Injectable()
export class SpecService {
  async getSpec(): Promise<OpenAPIObject> {
    try {
      const specPath = resolve(__dirname, '../../generated/openapi.json');
      const content = await readFile(specPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      Logger.error('Error reading OpenAPI spec:', error.stack);
      throw error;
    }
  }
}
