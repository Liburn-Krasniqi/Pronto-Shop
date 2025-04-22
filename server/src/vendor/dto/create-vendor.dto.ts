import { Type } from 'class-transformer';
import { IsEmail, isNotEmpty, IsNotEmpty, IsObject, IsOptional, isString, IsString, ValidateNested } from 'class-validator';
import { VendorAddressDto } from './vendorAddress.dto';

export class CreateVendorDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    businessName: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    phone_number: string

    @IsOptional()
    @ValidateNested()
    @Type(() => VendorAddressDto)
    address?: VendorAddressDto;
}