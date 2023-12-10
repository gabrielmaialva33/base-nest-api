import { Test, TestingModule } from '@nestjs/testing';

import { SessionsController } from '@src/modules/sessions/controllers/sessions.controller';
import { SessionsService } from '@src/modules/sessions/services/sessions.service';

describe('SessionsController', () => {
  let controller: SessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [SessionsService],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
