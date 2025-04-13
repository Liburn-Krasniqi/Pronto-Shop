import { Controller, Post, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async createCheckout(@Body() createCheckoutDto: CreateCheckoutDto) {
    return this.checkoutService.createCheckout(createCheckoutDto);
  }
}
