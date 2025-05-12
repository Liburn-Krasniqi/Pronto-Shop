import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtVendorStrategy extends PassportStrategy(Strategy, 'jwt-vendor') {
    constructor(config: ConfigService, private prisma: PrismaService) {

    const jwtSecret = config.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
        
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: payload.sub },
    });

    if (!vendor) throw new UnauthorizedException();

    delete (vendor as any).hash;
    return vendor;
  }
}
