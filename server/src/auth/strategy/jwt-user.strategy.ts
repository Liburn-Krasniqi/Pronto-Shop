import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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

  async validate(payload: {
    sub: number,
    email: string,
    type: 'user' | 'vendor' | 'admin'
  }) {
    let user;
    
    if (payload.type === 'user' || payload.type === 'admin') {
      user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub
        }
      });
    } else if (payload.type === 'vendor') {
      user = await this.prisma.vendor.findUnique({
        where: {
          id: payload.sub
        }
      });
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    delete (user as any).hash;
    return {
      ...user,
      type: payload.type
    };
  }
}
