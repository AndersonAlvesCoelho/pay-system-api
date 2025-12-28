import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({
    description: 'Identificador único do cliente (UUID).',
    format: 'uuid',
    example: 'd8c3f5a0-4c3e-4b71-92a7-9f1f9f524c92',
  })
  id: string;

  @ApiProperty({ description: 'Nome completo do cliente.', example: 'João da Silva' })
  name: string;

  @ApiProperty({ description: 'E-mail do cliente.', example: 'joao.silva@paysystem.com' })
  email: string;

  @ApiProperty({ description: 'Documento do cliente (CPF ou CNPJ), se fornecido.', example: '12345678901', required: false })
  document?: string;

  @ApiProperty({ description: 'Telefone do cliente, se fornecido.', example: '(11) 98765-4321', required: false })
  phone?: string;

  @ApiProperty({ description: 'Data e hora da criação do registro.', example: '2025-10-24T00:11:33.884Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data e hora da última atualização do registro.', example: '2025-10-25T01:11:33.884Z' })
  updatedAt: Date;
}
