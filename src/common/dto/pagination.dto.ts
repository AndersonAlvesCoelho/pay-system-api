import { ApiPropertyOptional } from '@nestjs/swagger';
import { ChargeStatus, PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

/**
 * DTO genérico de paginação e filtros.
 * 
 * Pode ser utilizado em diversos módulos (ex: cobranças, clientes, transações),
 * permitindo paginação, busca textual e filtros opcionais de data, status e valores.
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Número da página atual (inicia em 1).',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'O campo page deve ser um número.' })
  @Min(1, { message: 'O valor mínimo permitido para page é 1.' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de registros por página.',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'O campo limit deve ser um número.' })
  @Min(1, { message: 'O valor mínimo permitido para limit é 1.' })
  limit: number = 10;

  @ApiPropertyOptional({
    description:
      'Filtrar resultados por ID único de cliente (UUID). Útil para buscar registros relacionados a um cliente específico.',
    example: 'a3b2c1d4-5678-49e0-b890-12f3456789ab',
  })
  @IsOptional()
  @IsUUID('4', { message: 'O campo customerId deve ser um UUID válido.' })
  customerId?: string;

  @ApiPropertyOptional({
    description:
      'Busca textual genérica (por nome, e-mail, título, etc). Implementação depende do módulo.',
    example: 'anderson@email.com',
  })
  @IsOptional()
  @IsString({ message: 'O campo search deve ser uma string.' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtra os resultados pelo status da cobrança.',
    enum: ChargeStatus,
    example: ChargeStatus.PAID,
  })
  @IsOptional()
  @IsEnum(ChargeStatus, {
    message: `O campo status deve ser um dos valores válidos: ${Object.values(
      ChargeStatus,
    ).join(', ')}.`,
  })
  status?: ChargeStatus;

  @ApiPropertyOptional({
    description: 'Filtra os resultados pelo método de pagamento.',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsOptional()
  @IsEnum(PaymentMethod, {
    message: `O campo paymentMethod deve ser um dos valores válidos: ${Object.values(
      PaymentMethod,
    ).join(', ')}.`,
  })
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Valor mínimo do intervalo de filtragem (em centavos ou reais).',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'O campo minAmount deve ser um número.' })
  minAmount?: number;

  @ApiPropertyOptional({
    description: 'Valor máximo do intervalo de filtragem (em centavos ou reais).',
    example: 5000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'O campo maxAmount deve ser um número.' })
  maxAmount?: number;

  @ApiPropertyOptional({
    description:
      'Data inicial do intervalo de criação (formato ISO 8601). Exemplo: "2025-01-01T00:00:00.000Z"',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'O campo startDate deve ser uma data válida (ISO).' })
  startDate?: string;

  @ApiPropertyOptional({
    description:
      'Data final do intervalo de criação (formato ISO 8601). Exemplo: "2025-01-31T23:59:59.000Z"',
    example: '2025-01-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'O campo endDate deve ser uma data válida (ISO).' })
  endDate?: string;
}
