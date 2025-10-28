import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// MODULE
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChargeModule } from './modules/charge/charge.module';
import { CustomerModule } from './modules/customer/customer.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CustomerModule,
    ChargeModule,
    AuthModule,
    AuditModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
