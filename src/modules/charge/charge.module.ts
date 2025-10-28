import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CustomerModule } from '../customer/customer.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChargeController } from './charge.controller';
import { ChargeService } from './charge.service';

@Module({
  imports: [PrismaModule, CustomerModule, AuthModule],
  controllers: [ChargeController],
  providers: [ChargeService],
})
export class ChargeModule {}
