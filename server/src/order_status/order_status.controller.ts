import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { OrderStatusService } from './order_status.service';

@Controller('order-status')
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @Get(':orderId')
  async getOrderStatus(@Param('orderId') orderId: string) {
    try {
      return await this.orderStatusService.getOrderDetails(orderId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Order not found');
    }
  }
}
