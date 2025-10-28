import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            create: jest.fn(),
            me: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login and return token', async () => {
      const dto: LoginAuthDto = { email: 'test@email.com', password: '123456' };
      const result = { access_token: 'token', user: { id: '1', email: dto.email, name: 'Test', role: 'user' } };
      (service.login as jest.Mock).mockResolvedValue(result);

      expect(await controller.login(dto)).toEqual(result);
      expect(service.login).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });

  describe('register', () => {
    it('should call authService.create and return token', async () => {
      const dto: CreateUserDto = { name: 'Test', email: 'test@email.com', password: '123456' };
      const result = { access_token: 'token', user: { id: '1', email: dto.email, name: dto.name, role: 'user' } };
      (service.create as jest.Mock).mockResolvedValue(result);

      expect(await controller.register(dto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('me', () => {
    it('should call authService.me and return user', async () => {
      const user = { id: '1', name: 'Test', email: 'test@email.com', role: 'user' };
      (service.me as jest.Mock).mockResolvedValue(user);

      const req = { user: { id: '1' } };
      expect(await controller.me(req)).toEqual(user);
      expect(service.me).toHaveBeenCalledWith('1');
    });
  });
});
