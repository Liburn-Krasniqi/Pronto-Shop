import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from '../user/user.module';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { PassportModule } from "@nestjs/passport";
import { RefreshTokenStrategy } from "./strategy/jwtRefresh.strategy";

@Module({
    imports: [PrismaModule, UserModule, JwtModule.register({}),PassportModule.register({ defaultStrategy: 'jwt' })],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy,RefreshTokenStrategy],
})
export class AuthModule{}