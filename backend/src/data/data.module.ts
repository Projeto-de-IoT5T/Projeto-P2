import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datum } from './entities/datum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Datum])],
  controllers: [DataController],
  providers: [DataService],
  exports: [DataService]
})
export class DataModule {}
