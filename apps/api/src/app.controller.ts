import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Greetings')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @ApiOperation({ summary: 'Say Hello' })
  @ApiResponse({ status: 200, description: 'Returns a greeting message.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
