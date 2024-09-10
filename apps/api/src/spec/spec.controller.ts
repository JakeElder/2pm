import { Controller, Get } from '@nestjs/common';
import { SpecService } from './spec.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class SpecController {
  constructor(private readonly specService: SpecService) {}

  @Get('openapi.json')
  @ApiExcludeEndpoint()
  getSpec() {
    return this.specService.getSpec();
  }
}
