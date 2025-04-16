import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

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
    @IsString()
    country?: string

    @IsOptional()
    @IsString()
    city?: string

    @IsOptional()
    @IsString()
    zipCode?: string

    @IsOptional()
    @IsString()
    street?: string
}