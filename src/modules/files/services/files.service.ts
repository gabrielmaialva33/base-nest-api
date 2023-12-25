import { Injectable } from '@nestjs/common';
import { omit } from 'helper-fns';

@Injectable()
export class FilesService {
  constructor() {}

  image(host: string, file: any) {
    const data = omit(file, ['path', 'dest']);
    return {
      ...data,
      url: `${host}/public/images/${file['filename']}`,
    };
  }
}
