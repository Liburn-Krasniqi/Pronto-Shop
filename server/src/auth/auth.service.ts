import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SignInDto } from "./dto/signin.dto";
import { SignUpDto } from "./dto/signup.dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    )
    
    {}

    async signup(dto: SignUpDto) {
        if(dto.password === dto.passwordRepeat){

        }else{
            throw new ForbiddenException(
                'Passwords do not match!',
            );
        }
      const hash = await argon.hash(dto.password);
      
      try{
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
                firstName: dto.firstName  ,
                lastName: dto.lastName,
                role: "user"
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                firstName: true,
                lastName: true
            }
        })
        return this.generateToken(user.id, user.email)
      }catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code === 'P2002'){
                    throw new ForbiddenException(
                        'Credentials taken',
                    );
                }
            }
          throw error;
      }
    }

    async signin(dto: SignInDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (!user){
            throw new ForbiddenException(
                'Credentials incorrect' + user,
            );
        }

        const pwMatches = await argon.verify(
            user.hash,
            dto.password,
        );

        if (!pwMatches){
            throw new ForbiddenException(
                'Credentials Incorrect'
            );
        }
        return this.generateToken(user.id, user.email)
    }

    async generateToken(userId: number, email: string): Promise<{ 
        access_token: string,
        refresh_token: string 
      }> {
        const payload = {
          sub: userId, 
          email
        };
        
        const secret = this.config.get('JWT_SECRET');
        const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
      
        const [access_token, refresh_token] = await Promise.all([
          this.jwt.signAsync(
            payload,
            {
              expiresIn: '30m',
              secret: secret
            }
          ),
          this.jwt.signAsync(
            payload,
            {
              expiresIn: '7d',
              secret: refreshSecret
            }
          )
        ]);
      
        await this.prisma.refreshToken.create({
          data: {
            userId,
            token: refresh_token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        });
      
        return {
          access_token,
          refresh_token
        };
    }

    async refreshTokens(userId: number, email: string, refreshToken: string) {
        await this.prisma.refreshToken.deleteMany({
          where: {
            token: refreshToken
          }
        });
      
        return this.generateToken(userId, email);
    }

    async logout(userId: number, refreshToken: string) {

        await this.prisma.refreshToken.updateMany({
          where: {
            userId,
            token: refreshToken
          },
          data: {
            revoked: true
          }
        });
    }
}