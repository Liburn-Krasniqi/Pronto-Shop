import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Get all dummy items' })
  @ApiQuery({ name: 'search', required: false, description: 'Search filter' })
  @ApiResponse({ status: 200, description: 'List of dummy items' })
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  // @Post('signin')
  // signin(@Body() dto: AuthDto){
  //     return this.authService.signin(dto);
  // }
}
