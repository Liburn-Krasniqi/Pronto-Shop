import { Model, FilterQuery } from 'mongoose';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas';
import { CreateLogDto, LogQueryParams } from './dto';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async createLog(createLogDto: CreateLogDto): Promise<Log> {
    try {
      return this.logModel.create(createLogDto);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create log: ${error.message}`,
      );
    }
  }

  // This also works for unfiltered queries because: "FilterQuery<Log> = {}" is the default, meaning no conditionss
  async findAll(query: LogQueryParams = {}): Promise<Log[]> {
    const filter: FilterQuery<Log> = {};

    if (query.action) filter.action = query.action;
    if (query.userId) filter.userId = query.userId;

    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      };
    }

    if (query.productId) {
      filter['metadata.productId'] = query.productId;
    }

    return this.logModel.find(filter).exec(); // Example: findAll({ action: 'viewed_product' })
  }

  // Update operation seems unecessary for logs IMO

  // New opinion: Update operation could be usefull if the Log has a count value field, e.g., if the same
  // user views the same product twice, the count should increment and the 'updatedAt' value changed to
  // time.now(). But this seems rather cumbersome...

  async deleteLogs(
    query: LogQueryParams = {},
  ): Promise<{ deletedCount: number }> {
    const filter: FilterQuery<Log> = {};
    if (query.userId) filter.userId = query.userId;
    if (query.productId) filter.productId = query.productId;
    try {
      const result = await this.logModel.deleteMany(filter).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException('No logs matching the filter');
      }
      return { deletedCount: result.deletedCount };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete logs: ${error.message}`,
      );
    }
  }
}
