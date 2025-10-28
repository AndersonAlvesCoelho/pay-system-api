import { PrismaClient as PrismaAuditClient } from '.prisma/audit-client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaAuditService extends PrismaAuditClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('[PrismaAuditService] Connected to AUDIT (MariaDB)');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('[PrismaAuditService] Disconnected from AUDIT');
  }
}
