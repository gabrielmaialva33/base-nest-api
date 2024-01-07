import { Controller, Post, Req, UseInterceptors } from '@nestjs/common';

import * as path from 'path';
import * as process from 'process';

import {
  FileInterceptor,
  MemoryStorageFile,
  UploadedFile,
} from '@blazity/nest-file-fastify';

import { FilesService } from '@src/modules/files/services/files.service';
import { FastifyRequest } from 'fastify';
import { Auth } from '@src/common/decorators/auth.decorator';
import { Roles } from '@src/common/decorators/roles.decorator';
import { RoleType } from '@src/modules/roles/interfaces/roles.interface';

@Auth()
@Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
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
