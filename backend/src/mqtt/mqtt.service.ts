import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect } from 'mqtt';
import { DataService } from '../data/data.service';

@Injectable()
export class MqttService implements OnModuleInit {
  constructor(private readonly dataService: DataService) {}

  onModuleInit() {
    const client = connect('mqtt://host.docker.internal:1883');

    client.on('connect', () => {
      console.log('[MQTT] Conectado!');
      client.subscribe('monitoramento/ar');
    });

    client.on('message', async (topic, message) => {
      
      try {
        const payload = message.toString();
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
