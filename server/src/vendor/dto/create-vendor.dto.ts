import { Type } from 'class-transformer';
import { IsEmail, isNotEmpty, IsNotEmpty, IsObject, isString, IsString } from 'class-validator';

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

    @IsNotEmpty()
    @IsString()
    country: string

    @IsNotEmpty()
    @IsString()
    city: string

    @IsNotEmpty()
    @IsString()
    zipCode: string

    @IsNotEmpty()
    @IsString()
    street: string
}