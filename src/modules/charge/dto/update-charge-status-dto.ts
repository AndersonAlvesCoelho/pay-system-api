import { ApiProperty } from '@nestjs/swagger';
import { ChargeStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateChargeStatusDto {
  @ApiProperty({
    description: 'Novo status da cobrança',
    enum: Object.values(ChargeStatus),
    example: ChargeStatus.PAID,
  })
  @IsNotEmpty({ message: 'O campo "status" é obrigatório.' })
  @IsEnum(ChargeStatus, {
    message: `Status inválido. Valores permitidos: ${Object.values(
      ChargeStatus,
    ).join(', ')}.`,
  })
  status: ChargeStatus;
}
