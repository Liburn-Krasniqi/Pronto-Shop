import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { WebhookController } from './webhook.controller';
import { OrderModule } from '../order/order.module';
import { OrderService } from '../order/order.service';

@Module({
  imports: [ConfigModule, forwardRef(() => OrderModule)],
  controllers: [WebhookController],
  providers: [StripeService, OrderService],
  exports: [StripeService],
})
export class PaymentModule {} 