import { Module } from '@nestjs/common';
import { PrismaMainService } from './prisma-audit.service';
import { PrismaAuditService } from './prisma-main.service';

@Module({
  providers: [PrismaMainService, PrismaAuditService],
  exports: [PrismaMainService, PrismaAuditService],
})
export class PrismaModule {}
