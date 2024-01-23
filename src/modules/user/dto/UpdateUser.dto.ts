import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from "./CreateUser.dto";

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}