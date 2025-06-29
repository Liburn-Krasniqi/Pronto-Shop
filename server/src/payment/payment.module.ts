import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { WebhookController } from './webhook.controller';
import { OrderModule } from '../order/order.module';
import { GiftCardModule } from '../gift-card/gift-card.module';

@Module({
  imports: [ConfigModule, forwardRef(() => OrderModule), GiftCardModule],
  controllers: [WebhookController],
  providers: [StripeService],
  exports: [StripeService],
})
export class PaymentModule {} 