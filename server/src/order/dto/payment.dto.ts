import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class PaymentDetailsDto {
  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  cardHolder: string;

  @IsNotEmpty()
  @IsString()
  expiryDate: string;

  @IsNotEmpty()
  @IsString()
  cvv: string;
}

export class ProcessPaymentDto {
  @IsNotEmpty()
  paymentDetails: PaymentDetailsDto;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
} 