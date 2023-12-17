import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { SessionsController } from '@src/modules/sessions/controllers/sessions.controller';
import { SessionsService } from '@src/modules/sessions/services/sessions.service';

describe('SessionsController', () => {
  let controller: SessionsController;

  // services mock declaration
  const mockSessionsService = createMock<SessionsService>();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        SessionsService,
        {
          provide: SessionsService,
          useValue: mockSessionsService,
        },
      ],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
