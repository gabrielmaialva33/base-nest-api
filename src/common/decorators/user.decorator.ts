import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@user/entities/user.entity';

export const LoggedInUser = createParamDecorator(
  (data: keyof UserEntity, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return data ? user && user[data] : user;
  },
);
