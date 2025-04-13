import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Query } from '@nestjs/common';
import { Body, Controller, Post, Get, Delete } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogActions } from './actions';
import { CreateLogDto, LogQueryParams, LogResponseDto } from './dto';

@ApiTags('Analytics Logs')
@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Get('getLogs')
  @ApiOperation({
    summary: 'Retrieve filtered logs',
    description:
      'Fetch logs with optional filtering by action, user, product, or date range',
  })
  @ApiQuery({ name: 'action', enum: LogActions, required: false })
  @ApiQuery({ name: 'userId', required: false, example: 'user_123' })
  @ApiQuery({ name: 'productId', required: false, example: 'prod_456' })
  @ApiQuery({ name: 'startDate', required: false, example: '2025-01-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2025-12-31' })
  @ApiResponse({
    status: 200,
    type: [LogResponseDto],
    description: 'Successfully retrieved logs',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  findMany(@Query() query: LogQueryParams = {}) {
    return this.logsService.findAll(query);
  }

  @Post('createLog')
  @ApiOperation({
    summary: 'Create a new log entry',
    description: 'Record user actions like product views or purchases',
  })
  @ApiBody({ type: CreateLogDto })
  @ApiResponse({
    status: 201,
    type: LogResponseDto,
    description: 'Log created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid log data',
  })
  createLog(@Body() dto: CreateLogDto) {
    return this.logsService.createLog(dto);
  }

  @Delete('deleteLogs')
  @ApiOperation({
    summary: 'Delete logs',
    description: 'Remove logs by user, product, or other filters',
  })
  @ApiQuery({ name: 'userId', required: false, example: 'user_123' })
  @ApiQuery({ name: 'productId', required: false, example: 'prod_456' })
  @ApiResponse({
    status: 200,
    description: 'Delete operation result',
    schema: {
      example: { deletedCount: 5 },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No matching logs found',
  })
  deleteLogs(@Query() query: LogQueryParams = {}) {
    return this.logsService.deleteLogs(query);
  }
}
