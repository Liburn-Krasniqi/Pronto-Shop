import { IsNumber, IsOptional, IsObject, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProcessPaymentDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsObject()
  paymentDetails?: {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
  };
} 