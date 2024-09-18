import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('docs(/**)?')
  @ApiExcludeEndpoint()
  @Render('docs.html.ejs')
  async renderHtml() {
    console.log(await this.appService.getDocsParams());
    return this.appService.getDocsParams();
  }
}
