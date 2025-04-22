import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VendorAddressDto } from './vendorAddress.dto';

export class UpdateVendorDto{
    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    businessName?: string

    @IsOptional()
    @IsString()
    password?: string

    @IsOptional()
    @IsString()
    phone_number?: string

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VendorAddressDto)
    addresses?: VendorAddressDto[];
}