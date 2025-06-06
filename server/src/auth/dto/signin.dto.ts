import { IsEmail, IsString, IsIn } from 'class-validator';


export class SignInDto {
    @IsEmail()
    email: string;
  
    @IsString()
    password: string;

    @IsIn(['user', 'vendor', 'admin'])
    type: 'user' | 'vendor' | 'admin';

  }
  