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
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: SignInDto){
        return this.authService.signin(dto); 
    }
    
    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    async refreshToken(@Req() req: Request) {
        const user = req.user as { sub: number; email: string; refreshToken: string, type: 'user' | 'vendor' | 'admin' }; 
        
        const tokens = await this.authService.refreshTokens(user.sub, user.email, user.refreshToken, user.type);
        
        return tokens;
    }
}