import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaMainService } from '../prisma/prisma-audit.service';

// DTO's
import { Prisma } from '@prisma/client';
import { IPaginatedResult } from 'src/common/type/paginated-result.type';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaMainService) {}

  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const { email, document } = createCustomerDto;

    const existingCustomer = await this.prisma.customer.findFirst({
      where: {
        OR: [{ email: email }, ...(document ? [{ document: document }] : [])],
      },
    });

    if (existingCustomer) {
      if (existingCustomer.email === email) {
        throw new ConflictException('O e-mail fornecido já está cadastrado.');
      }
      if (document && existingCustomer.document === document) {
        throw new ConflictException(
          'O documento fornecido já está cadastrado.',
        );
      }
    }

    try {
      const newCustomer = await this.prisma.customer.create({
        data: {
          name: createCustomerDto.name,
          email: createCustomerDto.email,
          document: document,
          phone: createCustomerDto.phone,
        },
      });

      return newCustomer as CustomerResponseDto;
    } catch (error) {
      throw new BadRequestException(
        'Não foi possível cadastrar o cliente devido a um erro de dados.',
      );
    }
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<IPaginatedResult<CustomerResponseDto>> {
    const { page = 1, limit = 10, search } = pagination;

    const where: Prisma.CustomerWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { document: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, customers] = await Promise.all([
      this.prisma.customer.count({ where }),
      this.prisma.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: customers as CustomerResponseDto[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<CustomerResponseDto> {
    const customer = await this.prisma.customer.findUnique({
      where: { id, deletedAt: null },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente com ID "${id}" não encontrado.`);
    }

    return customer as CustomerResponseDto;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    await this.findOne(id);

    if (updateCustomerDto.email || updateCustomerDto.document) {
      const existing = await this.prisma.customer.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(updateCustomerDto.email
              ? [{ email: updateCustomerDto.email }]
              : []),
            ...(updateCustomerDto.document
              ? [{ document: updateCustomerDto.document }]
              : []),
          ],
        },
      });

      if (existing) {
        throw new ConflictException(
          `O ${existing.email === updateCustomerDto.email ? 'e-mail' : 'documento'} já está em uso por outro cliente.`,
        );
      }
    }

    try {
      const updatedCustomer = await this.prisma.customer.update({
        where: { id },
        data: updateCustomerDto,
      });

      return updatedCustomer as CustomerResponseDto;
    } catch (error) {
      throw new BadRequestException('Não foi possível atualizar o cliente.');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);

    const hasCharges = await this.prisma.charge.count({
      where: { customerId: id },
    });

    if (hasCharges > 0) {
      throw new ConflictException(
        'Não é possível remover este clientExistem cobranças vinculadas.',
      );
    }

    await this.prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: `Cliente com ID ${id} removido com sucesso.` };
  }
}
