import { Model, FilterQuery } from 'mongoose';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from './schemas';
import { CreateLogDto } from './dto';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async createLog(createLogDto: CreateLogDto): Promise<Log> {
    try {
      return this.logModel.create(createLogDto);
    } catch (error) {
      throw new Error(`Failed to create log: ${error.message}`);
    }
  }

  async deleteLogsByUser(userId: string): Promise<{ deletedCount: number }> {
    try {
      const result = await this.logModel.deleteMany({ userId }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`No logs found for user ${userId}`);
      }
      return { deletedCount: result.deletedCount };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete logs for user ${userId}: ${error.message}`,
      );
    }
  }

  async findAll(filter: FilterQuery<Log> = {}): Promise<Log[]> {
    return this.logModel.find(filter).exec(); // Example: findAll({ action: 'viewed_product' })
  }
  // This also works for unfiltered queries because: "FilterQuery<Log> = {}" is the default, meaning no conditionss
  // Update operation seems unecessary for logs IMO
}
