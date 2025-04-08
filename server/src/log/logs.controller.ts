import { Query } from '@nestjs/common';
import { Body, Controller, Post, Get, Delete } from '@nestjs/common';

import { LogsService } from './logs.service';
import { CreateLogDto, LogQueryParams } from './dto';

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Get('getLogs')
  findMany(@Query() query: LogQueryParams = {}) {
    return this.logsService.findAll(query);
  }

  @Post('createLog')
  createLog(@Body() dto: CreateLogDto) {
    return this.logsService.createLog(dto);
  }

  @Delete('deleteLogs')
  deleteLogs(@Query() query: LogQueryParams = {}) {
    return this.logsService.deleteLogs(query);
  }
}
