import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService{
    constructor(
        private prisma: PrismaService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ){}

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
    
        try {
          const user = await this.userModel.create({
            email: dto.email,
            password: hash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            address: {
                street: dto.address.street,
                city: dto.address.city,
                ...(dto.address.country && { country: dto.address.country })
            }
          });
    
          return {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address
          };
    
        } catch (error) {
          if (error.code === 11000) {
            throw new ForbiddenException('Credentials taken');
          }
          throw error;
        }
    }

    // async signin(dto: AuthDto){
    //     // find user by email
    //     const user = await this.prisma.user.findUnique({
    //         where: {
    //             email: dto.email,
    //         },
    //     });

    //     // if user does not exist throw exception
    //     if (!user){
    //         throw new ForbiddenException(
    //             'Credentials incorrect',
    //         );
    //     }

    //     //compare password
    //     const pwMatches = await argon.verify(
    //         user.hash,
    //         dto.password,
    //     );

    //     //if password incorrect throw exception
    //     if (!pwMatches){
    //         throw new ForbiddenException(
    //             'Credentials Incorrect'
    //         );
    //     }
        
    //     //this shouldnt return hash but idk how to do that right now
    //     //send back the user
    //     return user
    // }
}