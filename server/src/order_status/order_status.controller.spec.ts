import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusController } from './order_status.controller';

describe('OrderStatusController', () => {
  let controller: OrderStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderStatusController],
    }).compile();

    controller = module.get<OrderStatusController>(OrderStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
