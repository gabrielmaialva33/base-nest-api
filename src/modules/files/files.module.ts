import { Module } from '@nestjs/common';

import { FilesController } from '@src/modules/files/controllers/files.controller';
import { FilesService } from '@src/modules/files/services/files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
