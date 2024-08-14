# gui_app.py
import os
import subprocess
import tkinter as tk
from tkinter import messagebox

# Global variable to keep track of the server process
server_process = None

def start_server():
    global server_process
    if server_process is None or server_process.poll() is not None:
        # Path to your Django project directory
        project_directory = '/home/william/projects/guesthousereservationmanager/backend/'
        
        # Path to the virtual environment's activate script
        venv_path = '/home/william/projects/virtual_environs/guesthousenv/bin/activate'
        
        # Change the current working directory to your Django project directory
        os.chdir(project_directory)
        
        # Command to activate virtual environment and start the Django server
        command = f'source {venv_path} && python manage.py runserver 8001'
        
        # Start the Django server
        server_process = subprocess.Popen(command, shell=True, executable='/bin/bash')
        messagebox.showinfo("Server Status", "Django server started successfully!")
    else:
        messagebox.showwarning("Server Status", "Django server is already running.")

def stop_server():
    global server_process
    if server_process is not None:
        try:
            # Terminate the server process
            server_process.terminate()
            server_process.wait()  # Wait for the process to terminate
            messagebox.showinfo("Server Status", "Django server stopped successfully!")
            server_process = None
        except Exception as e:
            messagebox.showerror("Server Status", f"Failed to stop Django server: {e}")
    else:
        messagebox.showwarning("Server Status", "Django server is not running.")

# Create the GUI
root = tk.Tk()
root.title("Django Server Launcher")

start_button = tk.Button(root, text="Start Django Server", command=start_server)
start_button.pack(pady=10)

stop_button = tk.Button(root, text="Stop Django Server", command=stop_server)
# stop_button.pack(pady=10)

root.mainloop()
