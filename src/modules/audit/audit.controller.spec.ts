import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

describe('AuditController', () => {
  let controller: AuditController;
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        {
          provide: AuditService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuditController>(AuditController);
    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated logs', async () => {
      const query: PaginationDto = { page: 1, limit: 10 };
      const response = {
        data: [
          {
            id: 1,
            customerId: 'abc-123',
            entityType: 'Charge',
            action: 'DELETE',
            userId: null,
            details: { amount: 99.99, status: 'PENDING' },
            message: 'Deleted',
            createdAt: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(response);

      const result = await controller.findAll(query);

      expect(result).toEqual(response);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });
});
