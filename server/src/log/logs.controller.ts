import { Body, Controller, Post, Req } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto';

@Controller('log')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Post('createLog')
  signup(@Body() dto: CreateLogDto) {
    return this.logsService.createLog(dto);
  }
}
