import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Charge } from './charge.entity';

export class Customer {
  @ApiProperty({ example: 'a9e2e86e-b82b-41f5-b329-098a67a51a4f' })
  id: string;

  @ApiProperty({ example: 'jose.silva@email.com' })
  email: string;

  @ApiProperty({ example: 'José da Silva' })
  name: string;

  @ApiProperty({ example: '12345678900', required: false })
  document?: string;

  @ApiProperty({ example: '+55 61 99999-9999', required: false })
  phone?: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  role: Role;

  @ApiProperty({ example: '2025-10-21T12:34:56Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-21T12:34:56Z' })
  updatedAt: Date;

  @ApiProperty({ example: null, required: false })
  deletedAt?: Date | null;

  // Relação
  @ApiProperty({
    type: () => [Charge],
    required: false,
    description: 'Lista de cobranças associadas ao cliente',
  })
  charges?: Charge[];
}
