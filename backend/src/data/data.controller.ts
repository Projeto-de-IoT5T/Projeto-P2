import { Controller, Get, Delete, Param } from '@nestjs/common';
import { DataService } from './data.service';
import { CreateDatumDto } from './dto/create-datum.dto';
import { UpdateDatumDto } from './dto/update-datum.dto';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  findAll() {
    return this.dataService.findAll();
  }

  @Get('today')
  findToday() {
    return this.dataService.findToday();
  }

  @Get('after/:timestamp')
  findAfter(@Param('timestamp') timestamp: string) {
    return this.dataService.findAfter(timestamp);
  }

  @Delete()
  clearAll() {
    return this.dataService.clearAll();
  }

}
