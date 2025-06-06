import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async count() {
    return this.prisma.order.count();
  }

  async create(createOrderDto: CreateOrderDto) {
    const { userId, items, totalAmount, status, shippingAddress } = createOrderDto;
    
    const order = await this.prisma.order.create({
      data: {
        userId: parseInt(userId),
        total: totalAmount,
        status,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    });
    
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: parseInt(id) }
      });

      if (!order) {
        throw new Error(`Order with ID ${id} not found`);
      }

      const { userId, totalAmount, status, paymentIntentId } = updateOrderDto;
      const data: any = {
        updatedAt: new Date()
      };

      if (userId) data.userId = parseInt(userId);
      if (totalAmount) data.total = totalAmount;
      if (status) data.status = status;
      if (paymentIntentId) data.paymentIntentId = paymentIntentId;

      return this.prisma.order.update({
        where: { id: parseInt(id) },
        data,
        include: {
          items: true
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async getStats() {
    // Mock data for orders over time (last 7 days)
    const ordersOverTime = [
      { date: '2024-03-20', count: 12 },
      { date: '2024-03-21', count: 15 },
      { date: '2024-03-22', count: 8 },
      { date: '2024-03-23', count: 20 },
      { date: '2024-03-24', count: 25 },
      { date: '2024-03-25', count: 18 },
      { date: '2024-03-26', count: 22 },
    ];

    // Mock data for order status distribution
    const orderStatusDistribution = [
      { status: 'pending', count: 45 },
      { status: 'completed', count: 120 },
      { status: 'cancelled', count: 15 },
      { status: 'processing', count: 30 },
    ];

    // Mock data for top selling products
    const topProducts = [
      { name: 'Organic Bananas', sales: 150 },
      { name: 'Fresh Milk', sales: 120 },
      { name: 'Whole Grain Bread', sales: 95 },
      { name: 'Free-Range Eggs', sales: 85 },
      { name: 'Greek Yogurt', sales: 75 },
    ];

    return {
      ordersOverTime,
      orderStatusDistribution,
      topProducts,
    };
  }

  async findOne(id: number) {
    
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });


      if (!order) {
        console.log('Order not found for ID:', id);
        throw new Error(`Order with ID ${id} not found`);
      }

      return order;
    } catch (error) {
      console.error('Error finding order:', error);
      throw error;
    }
  }

  async findByUserId(userId: number) {
      
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          userId: userId
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return orders;
    } catch (error) {
      console.error('Error finding orders for user:', error);
      throw error;
    }
  }

  async updateOrderStatusByPaymentIntent(paymentIntentId: string, status: string) {
    try {
      const order = await this.prisma.order.findFirst({
        where: {
          paymentIntentId
        }
      });

      if (!order) {
        throw new Error(`Order with payment intent ${paymentIntentId} not found`);
      }

      return this.prisma.order.update({
        where: { id: order.id },
        data: { 
          status,
          updatedAt: new Date()
        },
        include: {
          items: true
        }
      });
    } catch (error) {
      throw error;
    }
  }
} 