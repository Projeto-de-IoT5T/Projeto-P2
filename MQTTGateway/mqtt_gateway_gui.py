import tkinter as tk
from tkinter import ttk, messagebox
import serial.tools.list_ports
import threading
import time
import json
import paho.mqtt.client as mqtt

# Variáveis globais
serial_conn = None
mqtt_client = None
thread_leitura = None
running = False

# MQTT
BROKER = 'localhost'
PORTA = 1883
TOPICO_ENVIO = 'monitoramento/ar'
TOPICO_COMANDO = 'monitoramento/controle'

# Função para listar as portas disponíveis
def listar_portas():
    return [port.device for port in serial.tools.list_ports.comports()]

# Conectar ao Arduino e iniciar leitura
def conectar_serial():
    global serial_conn, running, thread_leitura, mqtt_client

    porta = combo_porta.get()
    if not porta:
        messagebox.showwarning("Aviso", "Selecione uma porta serial.")
        return

    try:
        serial_conn = serial.Serial(porta, 9600, timeout=1)
        log("✅ Conectado à porta " + porta)
        btn_conectar.config(state="disabled")
        btn_desconectar.config(state="normal")

        # Conectar ao MQTT
        mqtt_client = mqtt.Client()
        mqtt_client.on_connect = on_mqtt_connect
        mqtt_client.on_message = on_mqtt_message
        mqtt_client.connect(BROKER, PORTA, 60)
        mqtt_client.loop_start()

        # Iniciar thread de leitura
        running = True
        thread_leitura = threading.Thread(target=leitura_serial)
        thread_leitura.start()
    except Exception as e:
        messagebox.showerror("Erro", f"Falha ao conectar: {e}")

# Desconectar
def desconectar_serial():
    global serial_conn, running, mqtt_client

    running = False
    if serial_conn and serial_conn.is_open:
        serial_conn.close()
        log("🔴 Desconectado.")
    if mqtt_client:
        mqtt_client.loop_stop()
        mqtt_client.disconnect()
    btn_conectar.config(state="normal")
    btn_desconectar.config(state="disabled")

# Thread que lê dados da serial
def leitura_serial():
    global serial_conn, mqtt_client
    while running:
        try:
            if serial_conn.in_waiting:
                linha = serial_conn.readline().decode('utf-8').strip()
                if linha:
                    log(f"[SERIAL ⬅️] {linha}")
                    mqtt_client.publish(TOPICO_ENVIO, linha)
                    log(f"[MQTT 📤] Enviado: {linha}")
        except Exception as e:
            log(f"[ERRO] Leitura serial: {e}")
        time.sleep(0.1)

# Callback de conexão ao MQTT
def on_mqtt_connect(client, userdata, flags, rc):
    if rc == 0:
        log("[MQTT] Conectado com sucesso.")
        client.subscribe(TOPICO_COMANDO)
        log(f"[MQTT] Subscrito em: {TOPICO_COMANDO}")
    else:
        log(f"[MQTT] Erro ao conectar: {rc}")

# Callback de recebimento MQTT
def on_mqtt_message(client, userdata, msg):
    global serial_conn
    comando = msg.payload.decode('utf-8')
    log(f"[MQTT 📥] Comando recebido: {comando}")
    if serial_conn and serial_conn.is_open:
        serial_conn.write((comando + "\n").encode())
        log(f"[SERIAL ➡️] Enviado: {comando}")

# Log visual
def log(msg):
    txt_log.insert(tk.END, msg + "\n")
    txt_log.see(tk.END)

# Interface gráfica
root = tk.Tk()
root.title("MQTT Gateway - Qualidade do Ar")

frame = ttk.Frame(root, padding=10)
frame.pack()

ttk.Label(frame, text="Selecione a Porta:").grid(column=0, row=0, padx=5, pady=5)
combo_porta = ttk.Combobox(frame, values=listar_portas(), width=30)
combo_porta.grid(column=1, row=0, padx=5, pady=5)

btn_conectar = ttk.Button(frame, text="Conectar", command=conectar_serial)
btn_conectar.grid(column=0, row=1, padx=5, pady=10)

btn_desconectar = ttk.Button(frame, text="Desconectar", command=desconectar_serial, state="disabled")
btn_desconectar.grid(column=1, row=1, padx=5, pady=10)

txt_log = tk.Text(root, height=15, width=60)
txt_log.pack(padx=10, pady=5)

btn_atualizar = ttk.Button(root, text="Atualizar Portas", command=lambda: combo_porta.config(values=listar_portas()))
btn_atualizar.pack(pady=5)

root.mainloop()

# updated_code[:3000]  # Truncado para visualização inicial

