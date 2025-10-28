import { Test } from '@nestjs/testing';
import { ChargeStatus, PaymentMethod, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CustomerService } from '../customer/customer.service';
import { PrismaMainService } from '../prisma/prisma-audit.service';
import { PrismaAuditService } from '../prisma/prisma-main.service';
import { ChargeController } from './charge.controller';
import { ChargeService } from './charge.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeStatusDto } from './dto/update-charge-status-dto';
import { UpdateChargeDto } from './dto/update-charge.dto';

describe('ChargeController', () => {
  let chargeController: ChargeController;
  let chargeService: ChargeService;

  const prismaMainMock = { charge: {} };
  const prismaAuditMock = { audit: jest.fn() };
  const customerServiceMock = { findOne: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ChargeController],
      providers: [
        ChargeService,
        { provide: PrismaMainService, useValue: prismaMainMock },
        { provide: PrismaAuditService, useValue: prismaAuditMock },
        { provide: CustomerService, useValue: customerServiceMock },
      ],
    }).compile();

    chargeService = moduleRef.get(ChargeService);
    chargeController = moduleRef.get(ChargeController);
  });

  const mockCustomer = {
    id: 'c1',
    name: 'John Doe',
    email: 'john@test.com',
    document: '12345678901',
    phone: '+5511999999999',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const fullChargeMock = {
    id: '1',
    amount: new Prisma.Decimal(99),
    currency: 'BRL',
    description: '',
    status: ChargeStatus.PENDING,
    paymentMethod: PaymentMethod.PIX,
    idempotencyKey: 'key1',
    customerId: 'c1',
    customer: mockCustomer,
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    paidAt: new Date(),
    failureReason: '',
    metadata: {},
    deletedAt: null,
  };

  describe('create', () => {
    it('should create a charge', async () => {
      const dto: CreateChargeDto = {
        customerId: 'c1',
        amount: 100,
        paymentMethod: PaymentMethod.PIX,
        idempotencyKey: 'key1',
      };

      const mockResult = {
        message: 'Cobrança criada com sucesso.',
        data: fullChargeMock,
      };

      jest.spyOn(chargeService, 'create').mockResolvedValue(mockResult);

      const result = await chargeController.create(dto, { userId: 'u1' });
      expect(result).toBe(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return paginated charges', async () => {
      const pagination: PaginationDto = { page: 1, limit: 10 };
      const mockResult = {
        data: [fullChargeMock],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      jest.spyOn(chargeService, 'findAll').mockResolvedValue(mockResult);

      const result = await chargeController.findAll(pagination);
      expect(result).toBe(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a single charge', async () => {
      const mockResult = {
        message: 'Cobrança encontrada com sucesso.',
        data: fullChargeMock,
      };

      jest.spyOn(chargeService, 'findOne').mockResolvedValue(mockResult);

      const result = await chargeController.findOne('1');
      expect(result).toBe(mockResult);
    });
  });

  describe('update', () => {
    it('should update a charge', async () => {
      const dto: UpdateChargeDto = { amount: 200 };
      const updatedCharge = { ...fullChargeMock, amount: new Decimal(200) };
      const mockResult = {
        message: 'Cobrança atualizada com sucesso.',
        data: updatedCharge,
      };

      jest.spyOn(chargeService, 'update').mockResolvedValue(mockResult);

      const result = await chargeController.update('1', dto, { userId: 'u1' });
      expect(result).toBe(mockResult);
    });
  });

  describe('updateStatus', () => {
    it('should update status', async () => {
      const dto: UpdateChargeStatusDto = { status: ChargeStatus.PAID };
      const updatedCharge = { ...fullChargeMock, status: ChargeStatus.PAID };

      jest.spyOn(chargeService, 'updateStatus').mockResolvedValue(updatedCharge);

      const result = await chargeController.updateStatus('1', dto, {
        user: { id: 'u1' },
      });
      expect(result).toBe(updatedCharge);
    });
  });

  describe('remove', () => {
    it('should remove a charge', async () => {
      const mockResult = {
        message: 'Cobrança removida com sucesso.',
        data: fullChargeMock,
      };
      jest.spyOn(chargeService, 'remove').mockResolvedValue(mockResult);

      const result = await chargeController.remove('1');
      expect(result).toBe(mockResult);
    });
  });
});
