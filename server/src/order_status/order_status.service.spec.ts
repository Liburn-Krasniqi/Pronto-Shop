import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusService } from './order_status.service';

describe('OrderStatusService', () => {
  let service: OrderStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderStatusService],
    }).compile();

    service = module.get<OrderStatusService>(OrderStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
