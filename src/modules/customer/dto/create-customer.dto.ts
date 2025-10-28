import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { PHONE_REGEX } from 'src/utils/helper/regex';
import { IsDocument } from 'src/utils/validator/is-document.validator';
import { IsFlexiblePhone } from 'src/utils/validator/is-phone.validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Nome completo do cliente.',
    example: 'João da Silva',
  })
  @IsNotEmpty({ message: 'O nome do cliente é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail único do cliente.',
    example: 'joao.silva@colmeia.com',
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  email: string;

  @ApiProperty({
    description: 'Documento de identificação do cliente (CPF ou CNPJ).',
    example: '12345678901',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O documento deve ser uma string.' })
  @IsDocument()
  document?: string;

  @ApiProperty({
    description:
      'Número de telefone do cliente (10 ou 11 dígitos). Pode conter parênteses, hífens e espaços.',
    example: '(11) 98765-4321',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  @Matches(PHONE_REGEX, {
    message: 'O telefone só pode conter dígitos, parênteses, hífens e espaços.',
  })
  @IsFlexiblePhone()
  phone?: string;
}
