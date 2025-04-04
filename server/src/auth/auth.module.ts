import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from '../user/user.module';

@Module({
    imports: [PrismaModule, UserModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule{}