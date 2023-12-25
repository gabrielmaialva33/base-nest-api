import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from '@src/modules/files/controllers/files.controller';
import { FilesService } from '@src/modules/files/services/files.service';

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [FilesService],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
