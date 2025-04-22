import {IsString, IsOptional  } from 'class-validator';

export class VendorAddressDto {
    @IsOptional()
    @IsString()
    id?: number;
  
    @IsOptional()
    @IsString()
    street?: string;
  
    @IsOptional()
    @IsString()
    city?: string;
  
    @IsOptional()
    @IsString()
    state?: string;
  
    @IsOptional()
    @IsString()
    postalCode?: string;
  
    @IsOptional()
    @IsString()
    country?: string;
}