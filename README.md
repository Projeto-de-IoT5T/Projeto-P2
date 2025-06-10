# 🌡️ Sistema de Monitoramento e Controle Ambiental

Projeto de IoT para monitoramento e controle da qualidade do ar. Integra sensores físicos com backend em NestJS, banco de dados PostgreSQL, frontend em Django com gráficos e predições por machine learning. A comunicação entre os componentes é feita via MQTT.

---

## 🧱 Arquitetura do Projeto

```
[ Arduino + Sensores (DHT11, MQ-135) + Fan ]
        ↕ Serial
[ MQTTGateway (Python) ] 
        ↕ MQTT
[ Backend (NestJS + PostgreSQL) ]
        ↕ REST API
[ Frontend (Django + ML) ]
```

---

## 🔧 Tecnologias Utilizadas

### Backend
- **NestJS** (Framework Node.js)
- **PostgreSQL**
- **MQTT.js** (para escuta de mensagens MQTT)
- Deploy: **Render**

### Frontend
- **Django**
- **Chart.js / Matplotlib** (gráficos)
- **Scikit-learn** (machine learning)
- Deploy: **Render**

### Dispositivo Físico
- **Arduino UNO**
- **Sensores:**
  - DHT11 (temperatura e umidade)
  - MQ-135 (qualidade do ar)
- **Atuador:**
  - Mini cooler 5V
- **MQTTGateway:**
  - Script Python que:
    - Lê dados seriais do Arduino e publica no tópico MQTT
    - Recebe comandos de controle via MQTT e envia ao Arduino via serial

---

## 📡 Comunicação MQTT

| Tópico                     | Direção      | Descrição                                      |
|---------------------------|--------------|------------------------------------------------|
| `monitoramento/ar`        | Arduino → BE | Dados dos sensores enviados ao backend         |
| `monitoramento/controle`  | FE → Arduino | Comandos de controle (ex: ligar/desligar fan)  |

---

## 📂 Estrutura do Projeto

```
.
├── backend/
│   ├── src/
│   └── ...
├── frontend/
│   ├── app/
│   └── ...
├── mqtt_gateway/
│   ├── gateway.py
│   └── ...
└── README.md
```

---

## 🚀 Backend NestJS

### Rotas da API

| Rota                        | Método | Descrição                                                   |
|----------------------------|--------|-------------------------------------------------------------|
| `/data/today`              | GET    | Retorna todos os dados registrados no dia atual            |
| `/data/after/:timestamp`   | GET    | Retorna dados registrados após um timestamp UNIX informado |

### Execução local

```bash
cd backend
npm install
npm run start:dev
```

---

## 📈 Frontend Django

Responsável por:
- Exibir dados em gráficos interativos
- Realizar predições com modelos de machine learning

### Execução local

```bash
cd frontend
pip install -r requirements.txt
python manage.py runserver
```

---

## ⚙️ MQTT Gateway (Python)

Responsável por:
- Coletar dados do Arduino via porta serial e publicar via MQTT
- Escutar comandos MQTT e enviá-los ao Arduino via serial

### Execução

```bash
cd mqtt_gateway
python gateway.py
```

---

## 🧪 Testando o Projeto

1. Conecte o Arduino via USB com sensores e fan já montados.
2. Execute `gateway.py` para ativar a ponte serial-MQTT.
3. Inicie o backend para escutar dados via MQTT e servir API REST.
4. Inicie o frontend Django para visualizar gráficos e predições.
5. Envie comandos pelo frontend (ex: ligar/desligar fan).

---

## 📌 Melhorias Futuras

- Autenticação de usuários no frontend
- Exportação de relatórios PDF
- Treinamento contínuo dos modelos de ML
- Detecção de anomalias

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
