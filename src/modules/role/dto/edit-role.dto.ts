import { PartialType } from '@nestjs/mapped-types';
import { StoreRoleDto } from '@role/dto/store-role.dto';

export class EditRoleDto extends PartialType(StoreRoleDto) {}
