import { ApiProperty } from '@nestjs/swagger';
import { ChargeStatus, PaymentMethod } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Customer } from './customer.entities';

export class Charge {
  @ApiProperty({ example: 'c73e0a5a-90a2-4a1e-8f6a-47b942e91841' })
  id: string;

  @ApiProperty({ example: 120.5, description: 'Valor da cobrança' })
  amount: Decimal;

  @ApiProperty({ example: 'BRL', description: 'Moeda da cobrança' })
  currency: string;

  @ApiProperty({
    example: 'Mensalidade do plano Premium',
    required: false,
  })
  description?: string;

  @ApiProperty({
    enum: ChargeStatus,
    example: ChargeStatus.PENDING,
    description: 'Status atual da cobrança',
  })
  status: ChargeStatus;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.PIX,
    description: 'Método de pagamento escolhido',
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    example: '8d19a6e0-bf2c-48b5-99db-72d94a74f882',
    description: 'Chave única para evitar duplicações (idempotência)',
  })
  idempotencyKey: string;

  @ApiProperty({
    example: '2025-11-05T23:59:59Z',
    required: false,
    description: 'Data de vencimento da cobrança',
  })
  dueDate?: Date | null;

  @ApiProperty({
    example: '2025-10-20T14:30:00Z',
    required: false,
    description: 'Data de pagamento, caso já tenha sido paga',
  })
  paidAt?: Date | null;

  @ApiProperty({
    example: 'Saldo insuficiente',
    required: false,
    description: 'Motivo da falha no pagamento, se aplicável',
  })
  failureReason?: string | null;

  @ApiProperty({
    example: { invoiceUrl: 'https://example.com/invoice/123' },
    required: false,
    description: 'Metadados adicionais da cobrança',
  })
  metadata?: Record<string, any>;

  @ApiProperty({ example: '7f4d52a9-f8b9-4a6e-bd8e-215ad48b1b42' })
  customerId: string;

  @ApiProperty({
    type: () => Customer,
    required: false,
    description: 'Cliente associado a esta cobrança',
  })
  customer?: Customer;

  @ApiProperty({ example: '2025-10-21T12:34:56Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-21T12:34:56Z' })
  updatedAt: Date;

  @ApiProperty({ example: null, required: false })
  deletedAt?: Date | null;
}
