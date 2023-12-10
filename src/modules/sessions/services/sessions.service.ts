import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionsService {
  signIn(body: any) {
    return { body };
  }
}
