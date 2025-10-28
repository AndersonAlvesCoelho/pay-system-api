import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChargeStatus, PaymentMethod } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class ChargeResponseDto {
  @ApiProperty({ description: 'Identificador único da cobrança (UUID)' })
  id: string;

  @ApiProperty({ description: 'Valor da cobrança', example: 150.75 })
  amount: number | Decimal;

  @ApiProperty({ description: 'Moeda da cobrança', example: 'BRL' })
  currency: string;

  @ApiPropertyOptional({
    description: 'Descrição da cobrança',
    example: 'Mensalidade do plano Premium',
  })
  description?: string;

  @ApiProperty({
    description: 'Status da cobrança',
    enum: Object.values(ChargeStatus),
    example: ChargeStatus.PENDING,
  })
  status: ChargeStatus;

  @ApiProperty({
    description: 'Método de pagamento utilizado',
    enum: Object.values(PaymentMethod),
    example: PaymentMethod.PIX,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Chave de idempotência para evitar duplicidades',
    example: '8d19a6e0-bf2c-48b5-99db-72d94a74f882',
  })
  idempotencyKey: string;

  @ApiPropertyOptional({
    description: 'Data de vencimento da cobrança',
    type: String,
    example: '2025-11-10T23:59:59Z',
  })
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Data de pagamento da cobrança',
    type: String,
    example: '2025-11-10T23:59:59Z',
  })
  paidAt?: Date;

  @ApiPropertyOptional({
    description: 'Motivo de falha caso a cobrança não tenha sido concluída',
    example: 'Saldo insuficiente',
  })
  failureReason?: string;

  @ApiPropertyOptional({
    description:
      'Metadados adicionais (JSON) para integrações externas ou detalhes do pagamento',
    example: { installments: 3, cardBrand: 'Visa' },
  })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'ID do cliente associado à cobrança' })
  customerId: string;

  @ApiProperty({
    description: 'Informações básicas do cliente associado',
    type: Object,
    example: {
      id: 'c1234...',
      name: 'Anderson Alves',
      email: 'anderson@email.com',
      document: '12345678901',
      phone: '+5511999999999',
    },
  })
  customer: {
    id: string;
    name: string;
    email: string;
    document?: string;
    phone?: string;
  };

  @ApiProperty({
    description: 'Data de criação do registro',
    type: String,
    example: '2025-10-24T00:11:33.884Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    type: String,
    example: '2025-10-24T01:11:33.884Z',
  })
  updatedAt: Date;
}
