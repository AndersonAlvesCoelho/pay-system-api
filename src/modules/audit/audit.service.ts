import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaAuditService } from '../prisma/prisma-main.service';

@Injectable()
export class AuditService {
  constructor(private readonly prismaAudit: PrismaAuditService) {}

  async findAll(query: PaginationDto) {
    const { page, limit, customerId } = query;

    console.log('Pagination Query:', query);

    const where: any = {};
    if (customerId) {
      where.customerId = customerId;
    }

    const [total, logs] = await Promise.all([
      this.prismaAudit.auditLog.count({ where }),
      this.prismaAudit.auditLog.findMany({
        where,
        orderBy: { id: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
