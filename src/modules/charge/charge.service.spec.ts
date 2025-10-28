import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ChargeStatus, PaymentMethod } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { CustomerService } from '../customer/customer.service';
import { PrismaMainService } from '../prisma/prisma-audit.service';
import { PrismaAuditService } from '../prisma/prisma-main.service';
import { ChargeService } from './charge.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeStatusDto } from './dto/update-charge-status-dto';
import { UpdateChargeDto } from './dto/update-charge.dto';

describe('ChargeService', () => {
  let service: ChargeService;
  let prismaMain: PrismaMainService;
  let prismaAudit: PrismaAuditService;
  let customerService: CustomerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ChargeService,
        {
          provide: PrismaMainService,
          useValue: {
            charge: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
        {
          provide: PrismaAuditService,
          useValue: {
            auditLog: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: CustomerService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ChargeService);
    prismaMain = moduleRef.get(PrismaMainService);
    prismaAudit = moduleRef.get(PrismaAuditService);
    customerService = moduleRef.get(CustomerService);
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
    amount: new Decimal(100),
    currency: 'BRL',
    description: null,
    status: ChargeStatus.PENDING,
    paymentMethod: PaymentMethod.PIX,
    idempotencyKey: 'key1',
    customerId: 'c1',
    customer: mockCustomer,
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: null,
    paidAt: null,
    failureReason: null,
    metadata: {},
  };

  describe('create', () => {
    it('should create a charge successfully', async () => {
      const dto: CreateChargeDto = {
        customerId: 'c1',
        amount: 100,
        paymentMethod: PaymentMethod.PIX,
        idempotencyKey: 'key1',
      };

      (customerService.findOne as jest.Mock).mockResolvedValue(mockCustomer);
      (prismaMain.charge.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaMain.charge.create as jest.Mock).mockResolvedValue(fullChargeMock);
      (prismaAudit.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await service.create(dto, 'u1');

      expect(result).toEqual({
        message: 'Cobrança criada com sucesso.',
        data: fullChargeMock,
      });
    });

    it('should throw if idempotencyKey exists', async () => {
      (customerService.findOne as jest.Mock).mockResolvedValue(mockCustomer);
      (prismaMain.charge.findUnique as jest.Mock).mockResolvedValue(fullChargeMock);

      await expect(
        service.create(
          {
            customerId: 'c1',
            amount: 100,
            paymentMethod: PaymentMethod.PIX,
            idempotencyKey: 'key1',
          },
          'u1',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated charges', async () => {
      const pagination = { page: 1, limit: 10 };
      (prismaMain.charge.count as jest.Mock).mockResolvedValue(1);
      (prismaMain.charge.findMany as jest.Mock).mockResolvedValue([fullChargeMock]);

      const result = await service.findAll(pagination);

      expect(result.data[0].id).toBe('1');
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return charge if exists', async () => {
      (prismaMain.charge.findUnique as jest.Mock).mockResolvedValue(fullChargeMock);

      const result = await service.findOne('1');

      expect(result.data.id).toBe('1');
    });

    it('should throw NotFoundException if charge not found', async () => {
      (prismaMain.charge.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a charge', async () => {
      const dto: UpdateChargeDto = { amount: 200 };
      const updatedCharge = { ...fullChargeMock, amount: new Decimal(200) };

      (prismaMain.charge.findUnique as jest.Mock).mockResolvedValue(fullChargeMock);
      (prismaMain.charge.update as jest.Mock).mockResolvedValue(updatedCharge);
      (prismaAudit.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await service.update('1', dto, 'u1');
      expect(result.data.amount.toNumber()).toBe(200);
    });
  });

  describe('updateStatus', () => {
    it('should update status successfully', async () => {
      const dto: UpdateChargeStatusDto = { status: ChargeStatus.PAID };
      const updatedCharge = { ...fullChargeMock, status: ChargeStatus.PAID };

      (prismaMain.charge.findUnique as jest.Mock).mockResolvedValue(fullChargeMock);
      (prismaMain.charge.update as jest.Mock).mockResolvedValue(updatedCharge);
      (prismaAudit.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await service.updateStatus('1', dto, 'u1');
      expect(result.status).toBe(ChargeStatus.PAID);
    });

    it('should throw BadRequestException if status is same', async () => {
      const dto: UpdateChargeStatusDto = { status: ChargeStatus.PENDING };
      (prismaMain.charge.findUnique as jest.Mock).mockResolvedValue(fullChargeMock);

      await expect(service.updateStatus('1', dto, 'u1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove charge successfully', async () => {
      (prismaMain.charge.findUnique as jest.Mock).mockResolvedValue(fullChargeMock);
      (prismaMain.charge.delete as jest.Mock).mockResolvedValue(fullChargeMock);
      (prismaAudit.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await service.remove('1');
      expect(result.data.id).toBe('1');
    });
  });
});
