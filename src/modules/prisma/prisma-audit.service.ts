import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient as PrismaMainClient } from '@prisma/client'; // Client principal

@Injectable()
export class PrismaMainService extends PrismaMainClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('[PrismaMainService] Connected to MAIN database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('[PrismaMainService] Disconnected from MAIN database');
  }
}
