import {
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaMainService } from '../prisma/prisma-audit.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

// Mock global do bcrypt (evita redefinição de propriedade)
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;

  // Mocks simples e diretos
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const jwtMock = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaMainService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user and return token', async () => {
      const dto: CreateUserDto = {
        name: 'Test',
        email: 'test@email.com',
        password: '123456',
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: '1',
        name: dto.name,
        email: dto.email,
        password: 'hashed',
        role: Role.USER,
      });

      const result = await service.create(dto);

      expect(result.access_token).toBe('mocked-jwt-token');
      expect(result.user.email).toBe(dto.email);
      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: dto.email,
            name: dto.name,
            password: 'hashed',
          }),
        }),
      );
    });

    it('should throw BadRequestException if email exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'exists@email.com',
      });

      await expect(
        service.create({
          name: 'Test',
          email: 'exists@email.com',
          password: '123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateUser', () => {
    it('should return user without password on valid credentials', async () => {
      const user = {
        id: '1',
        email: 'test@email.com',
        password: 'hashed',
        name: 'Test',
        role: Role.USER,
      };
      prismaMock.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@email.com', '123456');
      expect(result).toEqual({
        id: '1',
        email: 'test@email.com',
        name: 'Test',
        role: Role.USER,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(
        service.validateUser('unknown@email.com', '123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if password invalid', async () => {
      const user = {
        id: '1',
        email: 'test@email.com',
        password: 'hashed',
        name: 'Test',
        role: Role.USER,
      };
      prismaMock.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@email.com', 'wrongpassword'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return token and user data', async () => {
      const user = {
        id: '1',
        email: 'test@email.com',
        name: 'Test',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(user);

      const result = await service.login('test@email.com', '123456');

      expect(result.access_token).toBe('mocked-jwt-token');
      expect(result.user).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    });
  });

  describe('me', () => {
    it('should return user data', async () => {
      const user = {
        id: '1',
        name: 'Test',
        email: 'test@email.com',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await service.me('1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.me('1')).rejects.toThrow(NotFoundException);
    });
  });
});
