import { IsNotEmpty } from 'class-validator';

export class CreateCarDTO {
  @IsNotEmpty({message: 'O nome não pode ser vazio'})
  name: string;

  @IsNotEmpty({message: 'A descrição não pode ser vazia'})
  description: string;

  @IsNotEmpty({message: 'O valor deve ser preenchido'})
  value: string;

  image_url: string;
  carOwnerEmail: string;
  carOwnerPhone: string;
}