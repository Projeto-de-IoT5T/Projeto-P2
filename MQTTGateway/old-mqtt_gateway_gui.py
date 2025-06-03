import tkinter as tk
from tkinter import ttk, messagebox
import serial.tools.list_ports
import threading

# Variáveis globais
serial_conn = None

# Função para listar as portas disponíveis
def listar_portas():
    return [port.device for port in serial.tools.list_ports.comports()]

# Conectar ao Arduino
def conectar_serial():
    global serial_conn
    porta = combo_porta.get()
    if not porta:
        messagebox.showwarning("Aviso", "Selecione uma porta serial.")
        return

    try:
        serial_conn = serial.Serial(porta, 9600, timeout=1)
        log("✅ Conectado à porta " + porta)
        btn_conectar.config(state="disabled")
        btn_desconectar.config(state="normal")
    except Exception as e:
        messagebox.showerror("Erro", f"Falha ao conectar: {e}")

# Desconectar
def desconectar_serial():
    global serial_conn
    if serial_conn and serial_conn.is_open:
        serial_conn.close()
        log("🔌 Desconectado.")
        btn_conectar.config(state="normal")
        btn_desconectar.config(state="disabled")

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

txt_log = tk.Text(root, height=10, width=50)
txt_log.pack(padx=10, pady=5)

btn_atualizar = ttk.Button(root, text="Atualizar Portas", command=lambda: combo_porta.config(values=listar_portas()))
btn_atualizar.pack(pady=5)

root.mainloop()
