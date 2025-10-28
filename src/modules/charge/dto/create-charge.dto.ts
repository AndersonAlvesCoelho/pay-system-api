import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateChargeDto {
  @ApiProperty({
    description: 'ID do cliente vinculado à cobrança',
    example: 'd8c3f5a0-4c3e-4b71-92a7-9f1f9f524c92',
  })
  @IsUUID('4', { message: 'O campo customerId deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O campo customerId é obrigatório.' })
  customerId: string;

  @ApiProperty({
    description: 'Valor total da cobrança',
    example: 199.99,
  })
  @IsNumber({}, { message: 'O valor informado deve ser numérico.' })
  @IsNotEmpty({ message: 'O valor da cobrança é obrigatório.' })
  amount: number;

  @ApiPropertyOptional({
    description: 'Moeda da cobrança (ex: BRL, USD)',
    example: 'BRL',
    default: 'BRL',
  })
  @IsOptional()
  @IsString({ message: 'A moeda deve ser uma string válida (ex: BRL).' })
  currency?: string;

  @ApiProperty({
    description: 'Forma de pagamento utilizada',
    enum: Object.values(PaymentMethod),
    example: PaymentMethod.PIX,
  })
  @IsEnum(PaymentMethod, {
    message: `Método de pagamento inválido. Valores válidos: ${Object.values(
      PaymentMethod,
    ).join(', ')}.`,
  })
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Descrição opcional da cobrança',
    example: 'Assinatura mensal do plano Premium',
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Data de vencimento (necessária para boleto ou agendamento)',
    example: '2025-11-10T23:59:59Z',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'A data de vencimento deve estar em formato ISO 8601.' },
  )
  dueDate?: string;

  @ApiProperty({
    description: 'Chave única para garantir idempotência da criação',
    example: 'charge-2025-uuid-1234',
  })
  @IsNotEmpty({ message: 'O campo idempotencyKey é obrigatório.' })
  @IsString({ message: 'A chave de idempotência deve ser uma string.' })
  idempotencyKey: string;

  @ApiPropertyOptional({
    description:
      'Metadados adicionais para integrações externas ou detalhes de pagamento',
    example: { installments: 3, cardBrand: 'Visa' },
  })
  @IsOptional()
  @IsObject({ message: 'O campo metadata deve ser um objeto JSON válido.' })
  metadata?: Record<string, any>;
}
