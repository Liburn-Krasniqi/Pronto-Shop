import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from '../user/user.module';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from "./strategy/jwt-user.strategy";
import { RefreshTokenStrategy } from "./strategy/jwtRefresh.strategy";
import { JwtVendorStrategy } from "./strategy/jwt-vendor.strategy";

@Module({
    imports: [
        PrismaModule,
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '30m' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RefreshTokenStrategy, JwtVendorStrategy],
    exports: []
})
export class AuthModule{}