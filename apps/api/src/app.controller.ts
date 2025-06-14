import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @Get(['docs', 'docs/*path'])
  @Render('docs.html.ejs')
  async renderHtml() {
    return this.appService.getDocsParams();
  }
}
