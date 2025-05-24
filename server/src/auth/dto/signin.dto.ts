import { IsEmail, IsString, IsIn } from 'class-validator';


export class SignInDto {
    @IsEmail()
    email: string;
  
    @IsString()
    password: string;

    @IsIn(['user', 'vendor'])
    type: 'user' | 'vendor';

  }
  