import {IsNotEmpty, IsString, IsOptional  } from 'class-validator';

export class AddressDto {
    @IsString()
    @IsNotEmpty()
    street: string;
  
    @IsString()
    @IsNotEmpty()
    city: string;
  
    @IsString()
    @IsOptional()
    country?: string;
}
  