import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SignInDto } from "./dto/signin.dto";
import { SignUpDto } from "./dto/signup.dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService,){}

    async signup(dto: SignUpDto) {
      const hash = await argon.hash(dto.password);
      
      try{
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
                firstName: dto.firstName  ,
                lastName: dto.lastName,
                role: "user",
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                firstName: true,
                lastName: true,
            }
        })
        return user;
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
        // find user by email
        console.log()
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        // if user does not exist throw exception
        if (!user){
            throw new ForbiddenException(
                'Credentials incorrect' + user,
            );
        }

        //compare password
        const pwMatches = await argon.verify(
            user.hash,
            dto.password,
        );

        //if password incorrect throw exception
        if (!pwMatches){
            throw new ForbiddenException(
                'Credentials Incorrect'
            );
        }
        
        //this shouldnt return hash but idk how to do that right now
        //send back the user
        delete (user as any).hash;
        return user
    }
}