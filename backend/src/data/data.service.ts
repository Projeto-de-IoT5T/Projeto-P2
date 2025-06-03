import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Datum } from './entities/datum.entity';
import { Between } from 'typeorm';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(Datum)
    private readonly dataRepository: Repository<Datum>,
  ) {}

  create(tipo: string, valor: number) {
    const newDatum = this.dataRepository.create({ tipo, valor });
    return this.dataRepository.save(newDatum);
  }

  findAll() {
    return this.dataRepository.find({
      order: { criadoEm: 'DESC' },
      take: 100, // por exemplo
    });
  }

  async findToday(): Promise<Datum[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return this.dataRepository.find({
      where: {
        criadoEm: Between(today, tomorrow),
      },
      order: {
        criadoEm: 'ASC',
      },
    });
  }

  async findAfter(timestamp: string): Promise<Datum[]> {
    const from = new Date(timestamp);
    return this.dataRepository.find({
      where: {
        criadoEm: MoreThan(from),
      },
      order: {
        criadoEm: 'ASC',
      },
    });
  }

  

  clearAll() {
    return this.dataRepository.clear();
  }
}
