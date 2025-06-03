import { Injectable, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationShutdown, OnModuleDestroy {
  onApplicationShutdown(signal?: string) {
    console.log(`[NestJS] Encerrando aplicação por: ${signal}`)
  }

  onModuleDestroy() {
    console.log(`[NestJS] Módulo destruído, liberando recursos...`)
  }
  
  getHello(): string {
    return 'Hello World!';
  }
}
