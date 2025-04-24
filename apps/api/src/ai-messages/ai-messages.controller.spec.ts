import { Test, TestingModule } from '@nestjs/testing';
import { AiMessagesController } from './ai-messages.controller';
import { AiMessagesService } from './ai-messages.service';

describe('AiMessagesController', () => {
  let controller: AiMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiMessagesController],
      providers: [AiMessagesService],
    }).compile();

    controller = module.get<AiMessagesController>(AiMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
