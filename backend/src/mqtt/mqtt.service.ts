import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { DataService } from '../data/data.service';
import { ConfigService } from '@nestjs/config';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: MqttClient;
  private brokerUrl: string | undefined;
  private topic: string | undefined; 
  private mqttUser: string | undefined;
  private mqttPassword: string | undefined;

  constructor(
    private readonly dataService: DataService,
    private readonly configService: ConfigService
  ) {}

  onModuleInit() {
    this.brokerUrl = this.configService.get<string>('MQTT_BROKER');
    this.topic = this.configService.get<string>('MQTT_TOPIC');
    this.mqttUser = this.configService.get<string>('MQTT_USER');
    this.mqttPassword = this.configService.get<string>('MQTT_PASSWORD');
    if (!this.brokerUrl || !this.topic) {
      console.error('[MQTT] Variáveis de ambiente MQTT_BROKER ou MQTT_TOPIC não definidas');
      return;
    }

    try {
      this.client = connect(this.brokerUrl, {
        username: this.mqttUser,
        password: this.mqttPassword,
      });
    } catch (err) {
      console.log(`[MQTT] Erro ao conectar ao broker:`, err)
    }

    this.client.on('connect', () => {
      console.log(`[MQTT] Conectado ao broker: ${this.brokerUrl}`);
      this.client.subscribe(this.topic!, (err) => {
        if (err) {
          console.error(`[MQTT] Erro ao assinar o tópico "${this.topic}":`, err);
        } else {
          console.log(`[MQTT] Assinando tópico: ${this.topic}`);
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      
      try {
        const payload = message.toString();;
        const leituras = payload.split(';')
        leituras.forEach(async (leitura) => {
          if (!leitura) return;

          const [tipo, valor] = leitura.split(':')
          const valorInt = parseInt(valor);

          if (isNaN(valorInt)) {
            console.warn(`[MQTT] Valor inválido para "${tipo}": ${valor}`)
            return;
          }

          await this.dataService.create(tipo, valorInt);
          console.log(`[MQTT] ${tipo} = ${valorInt} criado com sucesso`)
        });
        
      } catch (err) {
        console.error('[MQTT] Erro ao processar mensagem:', err);
      }
    });
  }
}
