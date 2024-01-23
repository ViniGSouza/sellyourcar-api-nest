import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthDTO {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha obrigatória' })
  password: string;
}