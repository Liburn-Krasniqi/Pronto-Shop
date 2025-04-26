import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
      ignoreExpiration: false,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: Request, payload: { sub: number; email: string }) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const token = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        token: refreshToken,
        expiresAt: { gt: new Date() },
        revoked: false
      }
    });

    if (!token) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    return { ...payload, refreshToken };
  }
}