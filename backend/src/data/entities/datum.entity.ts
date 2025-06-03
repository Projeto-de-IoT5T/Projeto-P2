import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Datum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string; // 'temperatura', 'umidade', 'gas', 'motor'

  @Column('int')
  valor: number;

  @CreateDateColumn()
  criadoEm: Date;
}
