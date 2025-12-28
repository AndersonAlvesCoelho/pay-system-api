import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(CustomerController);
    service = moduleRef.get(CustomerService);
  });

  const mockCustomer = {
    id: 'c1',
    name: 'João da Silva',
    email: 'joao.silva@paysystem.com',
    document: '12345678901',
    phone: '(11) 98765-4321',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('create', () => {
    it('should create a customer', async () => {
      const dto: CreateCustomerDto = {
        name: 'João da Silva',
        email: 'joao.silva@paysystem.com',
        document: '12345678901',
        phone: '(11) 98765-4321',
      };
      (service.create as jest.Mock).mockResolvedValue(mockCustomer);

      const result = await controller.create(dto);
      expect(result).toEqual(mockCustomer);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      const mockResult = { data: [mockCustomer], total: 1, page: 1, limit: 10, totalPages: 1 };
      (service.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.findAll({ page: 1, limit: 10 });
      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      (service.findOne as jest.Mock).mockResolvedValue(mockCustomer);

      const result = await controller.findOne('c1');
      expect(result).toEqual(mockCustomer);
      expect(service.findOne).toHaveBeenCalledWith('c1');
    });

    it('should throw NotFoundException if customer not found', async () => {
      (service.findOne as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('c1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const dto: UpdateCustomerDto = { name: 'Novo Nome' };
      const updatedCustomer = { ...mockCustomer, name: 'Novo Nome' };
      (service.update as jest.Mock).mockResolvedValue(updatedCustomer);

      const result = await controller.update('c1', dto);
      expect(result).toEqual(updatedCustomer);
      expect(service.update).toHaveBeenCalledWith('c1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      const mockMessage = { message: 'Cliente removido com sucesso.' };
      (service.remove as jest.Mock).mockResolvedValue(mockMessage);

      const result = await controller.remove('c1');
      expect(result).toEqual(mockMessage);
      expect(service.remove).toHaveBeenCalledWith('c1');
    });
  });
});
