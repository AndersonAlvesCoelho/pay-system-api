import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AdminOnlyGuard } from 'src/guards/admin-only.Guard';
import { AuditService } from './audit.service';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AdminOnlyGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @ApiOperation({
    summary: 'Listar logs de auditoria do sistema',
    description:
      'Retorna uma lista paginada de registros de auditoria (logs) com informações detalhadas sobre ações realizadas no sistema. Apenas administradores podem acessar.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número da página atual (padrão: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Quantidade de itens por página (padrão: 10)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, example: '2025-10-01T00:00:00.000Z', description: 'Data inicial do intervalo (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, example: '2025-10-27T23:59:59.000Z', description: 'Data final do intervalo (ISO 8601)' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de logs retornada com sucesso.',
    schema: {
      example: {
        data: [
          {
            id: 45,
            customerId: '66172761-5f1d-4be6-b5f8-834d4f28f325',
            entityType: 'Charge',
            action: 'DELETE',
            userId: null,
            details: {
              id: '66172761-5f1d-4be6-b5f8-834d4f28f325',
              amount: 99.99,
              currency: 'BRL',
              description: null,
              status: 'PENDING',
              paymentMethod: 'BANK_SLIP',
              idempotencyKey: 'charge-3-4f69647a',
              dueDate: null,
              paidAt: null,
              failureReason: null,
              metadata: null,
              customerId: '4f69647a-f3b6-4eb0-9776-bceee67da19c',
              createdAt: '2025-10-21T21:23:38.182Z',
              updatedAt: '2025-10-24T00:11:27.424Z',
              deletedAt: null,
            },
            message: 'Cobrança 66172761-5f1d-4be6-b5f8-834d4f28f325 removida com sucesso.',
            createdAt: '2025-10-24T00:11:33.884Z',
          },
        ],
        meta: {
          total: 120,
          page: 1,
          limit: 10,
          totalPages: 12,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token JWT ausente ou inválido.' })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas administradores podem visualizar logs.' })
  findAll(@Query() query: PaginationDto) {
    return this.auditService.findAll(query);
  }
}
