import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaMainService } from '../prisma/prisma-audit.service';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomerService', () => {
  let service: CustomerService;
  let prisma: PrismaMainService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: PrismaMainService,
          useValue: {
            customer: {
              findFirst: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            charge: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(CustomerService);
    prisma = moduleRef.get(PrismaMainService);
  });

  const mockCustomer = {
    id: 'c1',
    name: 'João da Silva',
    email: 'joao.silva@colmeia.com',
    document: '12345678901',
    phone: '(11) 98765-4321',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  describe('create', () => {
    it('should create a customer successfully', async () => {
      const dto: CreateCustomerDto = {
        name: 'João da Silva',
        email: 'joao.silva@colmeia.com',
        document: '12345678901',
        phone: '(11) 98765-4321',
      };

      (prisma.customer.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.customer.create as jest.Mock).mockResolvedValue(mockCustomer);

      const result = await service.create(dto);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw ConflictException if email exists', async () => {
      (prisma.customer.findFirst as jest.Mock).mockResolvedValue(mockCustomer);

      await expect(
        service.create({
          name: 'Outro',
          email: 'joao.silva@colmeia.com',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if document exists', async () => {
      (prisma.customer.findFirst as jest.Mock).mockResolvedValue(mockCustomer);

      await expect(
        service.create({
          name: 'Outro',
          email: 'outro@email.com',
          document: '12345678901',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      (prisma.customer.count as jest.Mock).mockResolvedValue(1);
      (prisma.customer.findMany as jest.Mock).mockResolvedValue([mockCustomer]);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data[0].id).toBe('c1');
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockCustomer);
      const result = await service.findOne('c1');
      expect(result.id).toBe('c1');
    });

    it('should throw NotFoundException if customer not found', async () => {
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne('c1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer successfully', async () => {
      const dto: UpdateCustomerDto = { name: 'Novo Nome' };
      const updatedCustomer = { ...mockCustomer, name: 'Novo Nome' };

      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockCustomer);
      (prisma.customer.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.customer.update as jest.Mock).mockResolvedValue(updatedCustomer);

      const result = await service.update('c1', dto);
      expect(result.name).toBe('Novo Nome');
    });

    it('should throw ConflictException if email or document already exists', async () => {
      const dto: UpdateCustomerDto = { email: 'email@existente.com' };
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockCustomer);
      (prisma.customer.findFirst as jest.Mock).mockResolvedValue({ ...mockCustomer, email: dto.email });

      await expect(service.update('c1', dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a customer successfully', async () => {
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockCustomer);
      (prisma.charge.count as jest.Mock).mockResolvedValue(0);
      (prisma.customer.update as jest.Mock).mockResolvedValue({ ...mockCustomer, deletedAt: new Date() });

      const result = await service.remove('c1');
      expect(result.message).toContain('c1');
    });

    it('should throw ConflictException if customer has charges', async () => {
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockCustomer);
      (prisma.charge.count as jest.Mock).mockResolvedValue(1);

      await expect(service.remove('c1')).rejects.toThrow(ConflictException);
    });
  });
});
 