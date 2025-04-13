import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { SignInDto } from "./dto/signin.dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: SignUpDto){
        console.log(dto);
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: SignInDto){
        // console.log(dto);
        return this.authService.signin(dto); 
    }
    
}