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
        if(dto.type === "user"){
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
                firstName: dto.firstName,
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
        return this.generateToken(user.id, user.email, 'user')
      }else if(dto.type === "vendor"){
        const vendor = await this.prisma.$transaction(async (tx) => {
          const createdVendor = await tx.vendor.create({
            data: {
              email: dto.email,
              hash,
              name: dto.name,
              businessName: dto.businessName,
              phone_number: dto.phone_number
            }
          });
  
          if (dto.address) {
            await tx.vendorAddress.create({
              data: {
                street: dto.address.street,
                city: dto.address.city,
                state: dto.address.state,
                postalCode: dto.address.postalCode,
                country: dto.address.country,
                vendor: {
                  connect: { id: createdVendor.id }
                }
              }
            });
          }
  
          return createdVendor;
        });

        return this.generateToken(vendor.id, vendor.email, 'vendor');
      }

      else {
        throw new ForbiddenException('Invalid account type');
      }

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
      let account: any;

      if(dto.type === "user"){
        account = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
      }else if(dto.type === "vendor"){
        account = await this.prisma.vendor.findUnique({
            where: {
                email: dto.email,
            },
        });
      }else{
        throw new ForbiddenException('Invalid account type');
      }

        if (!account){
            throw new ForbiddenException(
                'Credentials incorrect'
            );
        }

        const pwMatches = await argon.verify(
            account.hash,
            dto.password,
        );

        if (!pwMatches){
            throw new ForbiddenException(
                'Credentials Incorrect'
            );
        }
        return this.generateToken(account.id, account.email, dto.type);
    }

    async generateToken(userId: number, email: string, type: 'user' | 'vendor'): Promise<{ 
        access_token: string,
        refresh_token: string 
      }> {
        const payload = {
          sub: userId, 
          email,
          type
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
            token: refresh_token,
            type,
            userId: type==='user' ? userId : undefined,
            vendorId: type==='vendor' ? userId : undefined,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        });
      
        return {
          access_token,
          refresh_token
        };
    }

    async refreshTokens(userId: number, email: string, refreshToken: string, type: 'user' | 'vendor') {
        await this.prisma.refreshToken.deleteMany({
          where: {
            token: refreshToken,
            type,
            ...(type === 'user' ? { userId } : { vendorId: userId })
          }
        });
      
        return this.generateToken(userId, email, type);
    }

    async logout(userId: number, refreshToken: string, type: 'user' | 'vendor') {

        await this.prisma.refreshToken.updateMany({
          where: {
            token: refreshToken,
            type,
            ...(type === 'user' ? { userId } : { vendorId: userId })
          },
          data: {
            revoked: true
          }
        });
    }
}