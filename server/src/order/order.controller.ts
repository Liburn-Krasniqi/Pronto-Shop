import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, Request, HttpException, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProcessPaymentDto } from './dto/payment.dto';
import { JwtGuard } from '../auth/guard/jwt-user.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StripeService } from '../payment/stripe.service';

@ApiTags('Orders')
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

  @Get()
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of orders returned' })
  async findAll() {
    return this.orderService.findAll();
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total order count (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order count returned' })
  async count() {
    const count = await this.orderService.count();
    return { count };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order statistics returned' })
  async getStats() {
    return this.orderService.getStats();
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

  // ... other endpoints will be added later ...
} 