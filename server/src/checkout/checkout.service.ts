import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutDto, AddressDto } from './dto/create-checkout.dto';
import { AddressType, PaymentMethod, PaymentStatus, Role, ShippingMethod } from '@prisma/client';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  async createCheckout(createCheckoutDto: CreateCheckoutDto) {
    const { items, ...checkoutData } = createCheckoutDto;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Cart items are required');
    }

    // Get or create products
    const productIds = items.map(item => item.productId);
    const existingProducts = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });

    // Create products that don't exist
    const existingProductIds = new Set(existingProducts.map(p => p.id));
    const productsToCreate = items.filter(item => !existingProductIds.has(item.productId));

    if (productsToCreate.length > 0) {
      await this.prisma.product.createMany({
        data: productsToCreate.map(item => ({
          id: item.productId,
          name: `Product ${item.productId}`,
          description: 'Auto-created product',
          price: item.price,
          stock: item.quantity,
          images: ['https://via.placeholder.com/150'], // Default image
          featured: false,
          categoryId: null // No category for auto-created products
        }))
      });
    }

    // Create guest user if needed
    let userId = checkoutData.userId;
    if (!userId) {
      const guestUser = await this.prisma.user.create({
        data: {
          name: `${checkoutData.shippingAddress.firstName} ${checkoutData.shippingAddress.lastName}`,
          email: checkoutData.email,
          role: 'USER',
          isGuest: true,
          newsletter: checkoutData.newsletter || false,
        }
      });
      userId = guestUser.id;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // Create shipping address
    const shippingAddress = await this.prisma.address.create({
      data: {
        ...checkoutData.shippingAddress,
        type: 'SHIPPING',
        user: {
          connect: { id: userId }
        }
      }
    });

    // Create billing address if different
    let billingAddressId = shippingAddress.id;
    if (!checkoutData.sameAsBilling) {
      const billingAddress = await this.prisma.address.create({
        data: {
          ...checkoutData.billingAddress,
          type: 'BILLING',
          user: {
            connect: { id: userId }
          }
        }
      });
      billingAddressId = billingAddress.id;
    }

    // Create the order
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        user: {
          connect: { id: userId }
        },
        shippingAddress: {
          connect: { id: shippingAddress.id }
        },
        billingAddress: {
          connect: { id: billingAddressId }
        },
        shippingMethod: checkoutData.shippingMethod,
        shippingCost: checkoutData.shippingCost,
        subtotal: checkoutData.subtotal,
        tax: checkoutData.tax,
        total: checkoutData.total,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        },
        payment: {
          create: {
            method: checkoutData.payment.method,
            status: 'PENDING',
            amount: checkoutData.total,
            currency: 'USD',
            cardLastFour: checkoutData.payment.cardLastFour,
            cardBrand: checkoutData.payment.cardBrand,
            paypalEmail: checkoutData.payment.paypalEmail
          }
        }
      },
      include: {
        items: true,
        payment: true
      }
    });

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      orderId: order.id
    };
  }
}
