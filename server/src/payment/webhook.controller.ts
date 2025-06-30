import { Controller, Post, Headers, RawBodyRequest, Req, BadRequestException, Logger } from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import { OrderService } from '../order/order.service';
import { ConfigService } from '@nestjs/config';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly orderService: OrderService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async handleWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
      }

      if (!signature) {
        throw new BadRequestException('Stripe signature is missing');
      }

      // Get the raw body from the request
      const rawBody = request.rawBody;
      if (!rawBody) {
        throw new BadRequestException('Request body is missing');
      }

      const event = this.stripeService.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          await this.orderService.updateOrderStatusByPaymentIntent(
            paymentIntent.id,
            'completed'
          );
          break;

        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object;
          await this.orderService.updateOrderStatusByPaymentIntent(
            failedPaymentIntent.id,
            'cancelled'
          );
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`);
      throw error;
    }
  }
} 