import { Test } from '@nestjs/testing';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaAuditService } from '../prisma/prisma-main.service';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

describe('AuditController', () => {
  let auditController: AuditController;
  let auditService: AuditService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        AuditService,
        {
          provide: PrismaAuditService,
          useValue: {
            auditLog: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    auditService = moduleRef.get(AuditService);
    auditController = moduleRef.get(AuditController);
  });

  describe('findAll', () => {
    it('should return paginated logs', async () => {
      const query: PaginationDto = { page: 1, limit: 10 };

      const result = {
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

      jest.spyOn(auditService, 'findAll').mockResolvedValue(result);

      const response = await auditController.findAll(query);

      expect(response).toBe(result);
      expect(auditService.findAll).toHaveBeenCalledWith(query);
    });
  });
});
