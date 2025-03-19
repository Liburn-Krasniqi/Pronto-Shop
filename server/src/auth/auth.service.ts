import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService){}

    async signup(dto: AuthDto){
        const hash = await argon.hash(dto.password);
        
        try{
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
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

    async signin(dto: AuthDto){
        // find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        // if user does not exist throw exception
        if (!user){
            throw new ForbiddenException(
                'Credentials incorrect',
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
        
        //this shouldnt return hash but idk how to do that rn
        //send back the user
        return user
    }
}