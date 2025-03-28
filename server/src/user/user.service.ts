import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UserDto } from "./dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createUser(userDto: UserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }
}