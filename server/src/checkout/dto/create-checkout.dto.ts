import { PaymentMethod, ShippingMethod } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsNumber, Min, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsNotEmpty()
  address1: string;

  @IsString()
  @IsOptional()
  address2?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zip: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;
}

export class PaymentInfoDto {
  @IsString()
  @IsNotEmpty()
  method: PaymentMethod;

  @IsString()
  @IsOptional()
  cardLastFour?: string;

  @IsString()
  @IsOptional()
  cardBrand?: string;

  @IsString()
  @IsOptional()
  paypalEmail?: string;
}

export class CreateCheckoutDto {
  @IsString()
  @IsOptional()
  userId?: string;
  
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsBoolean()
  isGuest: boolean;

  @IsBoolean()
  newsletter: boolean;
  
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;
  
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress: AddressDto;
  
  @IsBoolean()
  sameAsBilling: boolean;

  @IsString()
  @IsNotEmpty()
  shippingMethod: ShippingMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  items: OrderItemDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentInfoDto)
  payment: PaymentInfoDto;
  
  @IsString()
  @IsOptional()
  promoCode?: string;
  
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  subtotal: number;
  
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  shippingCost: number;
  
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  tax: number;
  
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  total: number;
} 