import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, Request, HttpException, HttpStatus, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProcessPaymentDto } from './dto/payment.dto';
import { JwtGuard } from '../auth/guard/jwt-user.guard';
import { VendorGuard } from '../auth/guard/vendor.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { GetUser } from '../auth/decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { StripeService } from '../payment/stripe.service';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly stripeService: StripeService
  ) {}

  @Get('my-orders')
  @ApiOperation({ summary: 'Get orders for the current user' })
  @ApiResponse({ status: 200, description: 'List of user orders returned' })
  async getMyOrders(@Request() req) {
    
    if (!req.user?.id) {
      console.log('No user ID found in request');
      throw new NotFoundException('User not authenticated');
    }
    
    try {
      const orders = await this.orderService.findByUserId(req.user.id);
      
      return orders;
    } catch (error) {
      console.error('Error in getMyOrders:', error);
      throw error;
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of orders returned' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('count')
  @ApiOperation({ summary: 'Get total order count (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order count returned' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async count(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filter') filter?: string
  ) {
    const count = await this.orderService.count(startDate, endDate, filter);
    return { count };
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order statistics returned' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filter') filter?: string
  ) {
    return this.orderService.getStats(startDate, endDate, filter);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('extended-stats')
  @ApiOperation({ summary: 'Get extended dashboard statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Extended statistics returned' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getExtendedStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filter') filter?: string
  ) {
    return this.orderService.getExtendedStats(startDate, endDate, filter);
  }

  // Vendor-specific endpoints
  @UseGuards(VendorGuard)
  @Get('vendor/count')
  @ApiOperation({ summary: 'Get total order count for current vendor' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved vendor order count',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Total number of orders for the vendor'
        }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
  async getVendorOrderCount(
    @GetUser() user: { id: number },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filter') filter?: string
  ) {
    try {
      const count = await this.orderService.countByVendor(user.id, startDate, endDate, filter);
      return { count };
    } catch (error) {
      console.error('Error in vendor order count:', error);
      return { count: 0 };
    }
  }

  @UseGuards(VendorGuard)
  @Get('vendor/revenue')
  @ApiOperation({ summary: 'Get total revenue for current vendor' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved vendor revenue',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          description: 'Total revenue for the vendor'
        }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
  async getVendorRevenue(
    @GetUser() user: { id: number },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filter') filter?: string
  ) {
    try {
      const revenue = await this.orderService.getRevenueByVendor(user.id, startDate, endDate, filter);
      return { total: revenue };
    } catch (error) {
      console.error('Error in vendor revenue:', error);
      return { total: 0 };
    }
  }

  @UseGuards(VendorGuard)
  @Get('vendor/pending')
  @ApiOperation({ summary: 'Get pending order count for current vendor' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved vendor pending orders',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of pending orders for the vendor'
        }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
  async getVendorPendingOrders(
    @GetUser() user: { id: number },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filter') filter?: string
  ) {
    try {
      const count = await this.orderService.countPendingByVendor(user.id, startDate, endDate, filter);
      return { count };
    } catch (error) {
      console.error('Error in vendor pending orders:', error);
      return { count: 0 };
    }
  }

  @UseGuards(VendorGuard)
  @Get('vendor/orders')
  @ApiOperation({ summary: 'Get all orders for current vendor' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved vendor orders'
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
  async getVendorOrders(@GetUser() user: { id: number }) {
    try {
      return await this.orderService.findByVendor(user.id);
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      return [];
    }
  }

  @UseGuards(VendorGuard)
  @Get('vendor/stats')
  @ApiOperation({ summary: 'Get dashboard statistics for current vendor' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved vendor dashboard statistics',
    schema: {
      type: 'object',
      properties: {
        ordersOverTime: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string' },
              count: { type: 'number' }
            }
          }
        },
        orderStatusDistribution: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              count: { type: 'number' }
            }
          }
        },
        topProducts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              sales: { type: 'number' }
            }
          }
        },
        revenueOverTime: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string' },
              amount: { type: 'number' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
  async getVendorStats(
    @GetUser() user: { id: number },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filter') filter?: string
  ) {
    try {
      return await this.orderService.getVendorStats(user.id, startDate, endDate, filter);
    } catch (error) {
      console.error('Error fetching vendor stats:', error);
      return {
        ordersOverTime: [],
        orderStatusDistribution: [],
        topProducts: [],
        revenueOverTime: [],
      };
    }
  }

  @UseGuards(VendorGuard)
  @Post('vendor/sample-data')
  @ApiOperation({ summary: 'Create sample data for vendor dashboard testing' })
  @ApiResponse({ 
    status: 201, 
    description: 'Successfully created sample data'
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
  async createSampleData(@GetUser() user: { id: number }) {
    try {
      return await this.orderService.createSampleDataForVendor(user.id);
    } catch (error) {
      console.error('Error creating sample data:', error);
      throw error;
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order details returned' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string) {
    try {
      const order = await this.orderService.findOne(parseInt(id));
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Post(':id/payment')
  @ApiOperation({ summary: 'Process payment for an order' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid payment amount' })
  async processPayment(
    @Param('id') id: string,
    @Body() paymentDto: ProcessPaymentDto
  ) {
    try {
      const order = await this.orderService.findOne(parseInt(id));
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      // Check if amount is too small
      const minAmountUSD = 1.00;
      if (Number(paymentDto.amount) < Number(minAmountUSD)) {
        throw new HttpException(
          `The minimum payment amount is $${minAmountUSD.toFixed(2)}. Please add more items to your cart.`,
          HttpStatus.BAD_REQUEST
        );
      }

      // Create a payment intent with Stripe
      const paymentIntent = await this.stripeService.createPaymentIntent(paymentDto.amount);

      // Update order status and payment intent ID
      const updatedOrder = await this.orderService.update(id, {
        status: 'processing',
        paymentIntentId: paymentIntent.id
      });

      return {
        success: true,
        message: 'Payment intent created successfully',
        orderId: id,
        amount: paymentDto.amount,
        clientSecret: paymentIntent.client_secret
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof HttpException) {
        throw error;
      }
      // Log the error for debugging
      console.error('Payment processing error:', error);
      throw new HttpException(
        'Failed to process payment. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':id/gift-card')
  @ApiOperation({ summary: 'Apply gift card to an order' })
  @ApiResponse({ status: 200, description: 'Gift card applied successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid gift card or amount' })
  async applyGiftCard(
    @Param('id') id: string,
    @Body() body: { giftCardCode: string; amountToUse: number }
  ) {
    try {
      const result = await this.orderService.applyGiftCardToOrder(
        parseInt(id),
        body.giftCardCode,
        body.amountToUse
      );

      return {
        success: true,
        message: 'Gift card applied successfully',
        giftCardApplied: result.giftCardApplied,
        remainingBalance: result.remainingBalance,
        newOrderTotal: result.newOrderTotal
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Gift card application error:', error);
      throw new HttpException(
        error.message || 'Failed to apply gift card. Please try again.',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ... other endpoints will be added later ...
} 