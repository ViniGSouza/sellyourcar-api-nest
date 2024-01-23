import { IsEmail, IsNotEmpty, MaxLength, Min, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({message: 'O nome não pode ser vazio'})
  name: string;

  @IsEmail({},{message: 'Email inválido'})
  @IsNotEmpty({message: 'O email não pode ser vazio'})
  email: string;

  @MinLength(6, {message: 'A senha deve ter pelo menos 6 caracteres'})
  password: string;

  @MaxLength(11, {message: 'O telefone deve ter no máximo 11 caracteres'})
  phone: string;
}