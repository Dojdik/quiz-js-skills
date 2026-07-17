import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  create(@Body() dto: CreateResultDto) {
    return this.resultsService.create(dto);
  }

  @Get()
  findAll(@Query('limit') limit?: string) {
    const n = limit ? parseInt(limit, 10) : 20;
    return this.resultsService.findAll(Number.isFinite(n) ? n : 20);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resultsService.findOne(id);
  }
}
