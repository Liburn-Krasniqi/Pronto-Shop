import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderStatusService {
  constructor(private prisma: PrismaService) {}

  async getOrderDetails(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingAddress: true,
        billingAddress: true,
        items: {
          include: {
            product: true
          }
        },
        user: true,
        payment: true
      }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      status: order.status,
      email: order.user.email,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      items: order.items.map(item => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images[0]
      })),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      total: order.total,
      paymentMethod: order.payment?.method || 'CREDIT_CARD',
      shippingMethod: order.shippingMethod
    };
  }
}
