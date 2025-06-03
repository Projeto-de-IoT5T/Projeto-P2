import { Module } from '@nestjs/common';
import { DataModule } from 'src/data/data.module';
import { MqttService } from './mqtt.service';

@Module({    
    imports: [DataModule],
    providers: [MqttService]})
export class MqttModule {}

