import { Controller, Post, Req, UseInterceptors } from '@nestjs/common';

import * as path from 'path';
import * as process from 'process';

import {
  FileInterceptor,
  UploadedFile,
  MemoryStorageFile,
} from '@blazity/nest-file-fastify';

import { FilesService } from '@src/modules/files/services/files.service';
import { FastifyRequest } from 'fastify';

@Controller('files/images')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: path.join(process.cwd(), 'public', 'images'),
    }),
  )
  upload(
    @UploadedFile()
    file: MemoryStorageFile,
    @Req() req: FastifyRequest,
  ) {
    const host = `${req.protocol}://${req.headers.host}`;
    return this.filesService.image(host, file);
  }
}
