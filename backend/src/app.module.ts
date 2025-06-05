import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttService } from './mqtt/mqtt.service';
import { MqttModule } from './mqtt/mqtt.module';
import { DataModule } from './data/data.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataService } from './data/data.service';
import { Datum } from './data/entities/datum.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // Apenas para dev...
      }),
    }), 
    DataModule,
    TypeOrmModule.forFeature([Datum])],
  controllers: [AppController],
  providers: [AppService, MqttService, DataService, Datum],
})
export class AppModule {}
