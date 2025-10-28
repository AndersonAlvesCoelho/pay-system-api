import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'E-mail do usuário registrado no sistema.',
    example: 'anderson@email.com',
  })
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  email: string;

  @ApiProperty({
    description: 'Senha associada à conta do usuário.',
    example: '12345678',
  })
  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  password: string;
}
