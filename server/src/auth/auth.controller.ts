import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { SignInDto } from "./dto/signin.dto";
import { RefreshTokenGuard } from "./guard/jwtRefresh.guard";
import { Request } from 'express';

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
    
    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    async refreshToken(@Req() req: Request) {
        const user = req.user as { sub: number; email: string; refreshToken: string };
        
        // Generate new tokens
        const tokens = await this.authService.refreshTokens(user.sub, user.email, user.refreshToken);
        
        return tokens;
    }
}