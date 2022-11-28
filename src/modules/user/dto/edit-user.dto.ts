import { PartialType } from '@nestjs/mapped-types';
import { StoreUserDto } from '@user/dto/store-user.dto';

export class EditUserDto extends PartialType(StoreUserDto) {}
