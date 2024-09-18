import { Injectable } from '@nestjs/common';
import { generateSpecDocument } from './utils';

@Injectable()
export class AppService {
  async getDocsParams() {
    const apiDescriptionDocument = await generateSpecDocument();
    return {
      basePath: '/docs',
      apiDescriptionDocument: JSON.stringify(apiDescriptionDocument),
    };
  }
}
