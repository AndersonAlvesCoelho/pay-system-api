import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Decimal } from '@prisma/client/runtime/library';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPaginatedResult } from 'src/common/type/paginated-result.type';
import { CustomerService } from '../customer/customer.service';
import { PrismaMainService } from '../prisma/prisma-audit.service';
import { PrismaAuditService } from '../prisma/prisma-main.service';
import { ChargeResponseDto } from './dto/charge-response.dto';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeStatusDto } from './dto/update-charge-status-dto';
import { UpdateChargeDto } from './dto/update-charge.dto';

@Injectable()
export class ChargeService {
  constructor(
    private readonly prismaMain: PrismaMainService,
    private readonly prismaAudit: PrismaAuditService,

    private readonly customerService: CustomerService,
  ) {}

  async create(dto: CreateChargeDto, userId: string) {
    try {
      // Verifica se o cliente existe
      await this.customerService.findOne(dto.customerId);

      // Evita duplicidade via idempotencyKey
      const existingCharge = await this.prismaMain.charge.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
      });

      if (existingCharge) {
        throw new BadRequestException(
          'Cobrança já registrada com esta idempotencyKey.',
        );
      }

      // Criação da cobrança
      const charge = await this.prismaMain.charge.create({
        data: {
          customerId: dto.customerId,
          amount: dto.amount,
          currency: dto.currency ?? 'BRL',
          paymentMethod: dto.paymentMethod,
          idempotencyKey: dto.idempotencyKey,
        },
      });

      // Registro no log de auditoria
      await this.prismaAudit.auditLog.create({
        data: {
          customerId: charge.id,
          entityType: 'Charge',
          action: 'CREATE',
          userId,
          details: charge,
          message: `Cobrança criada com sucesso para o cliente ${dto.customerId}.`,
        },
      });

      return {
        message: 'Cobrança criada com sucesso.',
        data: charge,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erro ao criar cobrança:', error);
      await this.logError('CREATE', userId, error);
      throw new InternalServerErrorException('Erro ao criar cobrança.');
    }
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<IPaginatedResult<ChargeResponseDto>> {
    const {
      page = 1,
      limit = 10,
      customerId,
      status,
      paymentMethod,
      minAmount,
      maxAmount,
      startDate,
      endDate,
    } = pagination;

    const where: any = { deletedAt: null };

    if (customerId) where.customerId = customerId;
    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount !== undefined) where.amount.gte = minAmount;
      if (maxAmount !== undefined) where.amount.lte = maxAmount;
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [total, charges] = await Promise.all([
      this.prismaMain.charge.count({ where }),
      this.prismaMain.charge.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { customer: true },
      }),
    ]);

    return {
      data: charges.map((charge) => ({
        ...charge,
        amount:
          charge.amount instanceof Decimal
            ? charge.amount.toNumber()
            : charge.amount,
      })) as ChargeResponseDto[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllByCustomerId(customerId: string) {
    const charges = await this.prismaMain.charge.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { customer: true },
    });

    return {
      message: 'Lista de cobranças obtida com sucesso.',
      total: charges.length,
      data: charges,
    };
  }

  async findOne(id: string) {
    const charge = await this.prismaMain.charge.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!charge) {
      throw new NotFoundException('Cobrança não encontrada.');
    }

    return {
      message: 'Cobrança encontrada com sucesso.',
      data: charge,
    };
  }

  async update(id: string, dto: UpdateChargeDto, userId: string) {
    const existing = await this.prismaMain.charge.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Cobrança não encontrada.');

    const updated = await this.prismaMain.charge.update({
      where: { id },
      data: dto,
      include: { customer: true },
    });

    await this.prismaAudit.auditLog.create({
      data: {
        customerId: id,
        entityType: 'Charge',
        action: 'UPDATE',
        userId,
        details: { before: existing, after: updated },
        message: `Cobrança ${id} atualizada com sucesso.`,
      },
    });

    return {
      message: 'Cobrança atualizada com sucesso.',
      data: updated,
    };
  }

  async remove(id: string) {
    const existing = await this.prismaMain.charge.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Cobrança não encontrada.');

    const deleted = await this.prismaMain.charge.delete({ where: { id } });

    await this.prismaAudit.auditLog.create({
      data: {
        customerId: id,
        entityType: 'Charge',
        action: 'DELETE',
        details: existing,
        message: `Cobrança ${id} removida com sucesso.`,
      },
    });

    return {
      message: 'Cobrança removida com sucesso.',
      data: deleted,
    };
  }

  async updateStatus(id: string, dto: UpdateChargeStatusDto, userId: string) {
    const existing = await this.prismaMain.charge.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Cobrança não encontrada.');
    }

    // Evita redundância
    if (existing.status === dto.status) {
      throw new BadRequestException(
        `A cobrança já está com o status ${dto.status}.`,
      );
    }

    try {
      const updated = await this.prismaMain.charge.update({
        where: { id },
        data: { status: dto.status },
        include: { customer: true },
      });

      await this.prismaAudit.auditLog.create({
        data: {
          customerId: updated.customerId,
          entityType: 'Charge',
          action: 'UPDATE_STATUS',
          userId,
          details: { before: existing, after: updated },
          message: `Status da cobrança ${id} alterado de ${existing.status} para ${dto.status}.`,
        },
      });

      return updated;
    } catch (error) {
      await this.logError('UPDATE_STATUS', userId, error);
      throw new InternalServerErrorException(
        'Erro ao atualizar status da cobrança.',
      );
    }
  }

  private async logError(action: string, userId?: string | null, error?: any) {
    await this.prismaAudit.auditLog.create({
      data: {
        customerId: 'N/A',
        entityType: 'Charge',
        action,
        userId: userId ?? null,
        details: { error: error?.message ?? error },
        message: `Erro ao executar ação ${action} em Charge.`,
      },
    });
  }
}
