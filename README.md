# 🏋️‍♂️ GymManager Pro - Sistema de Gestión Integral

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v24-green.svg?logo=nodedotjs)
![Vite](https://img.shields.io/badge/Vite-v6.0-purple.svg?logo=vite)
![React](https://img.shields.io/badge/React-2026-61DAFB?logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)

> Una aplicación Full Stack potente y moderna para la gestión de centros deportivos, entrenadores y clientes.

---

## 🚀 Tecnologías Utilizadas

Este proyecto exprime al máximo las últimas versiones del ecosistema JavaScript para garantizar velocidad y escalabilidad:

### **Frontend**
* **Framework:** [React.js](https://reactjs.org/) con **Vite** (para una compilación instantánea).
* **Estilos:** Bootstrap 5 con personalizaciones CSS avanzadas (Glassmorphism y modo oscuro).
* **Iconos:** Bootstrap Icons.
* **Peticiones:** Axios.

### **Backend**
* **Entorno:** **Node.js v24** (Última generación).
* **Servidor:** Express.js.
* **Base de Datos:** MySQL.
* **Gestión de Archivos:** Multer (para subida de fotos de perfil).

---

## ✨ Características Principales

* **Autenticación Segura:** Panel de inicio de sesión para administradores.
* **Gestión de Entrenadores:** CRUD completo, especialidades y asignación de pagos.
* **Control de Clientes:** Seguimiento de peso, altura, objetivos y vinculación con entrenadores.
* **Validación de DNI Robusta:** Algoritmo integrado de validación de NIF (módulo 23) para evitar datos erróneos.
* **Diseño Responsive:** Interfaz adaptada a móviles y tablets con menús *Offcanvas*.
* **Sistema de Fotos:** Subida y visualización de imágenes de perfil en tiempo real.

---

## 🛠️ Instalación y Configuración

# ANTES DE CUALQUIER PASO EJECUTAR Y CREAR EL CONTENEDOR DOCKER QUE ESTÁ EN /servidor CON LOS NOMBRES:
* creacionDB.sql
* docker-compose.yml

### 1. Clonar el repositorio
```bash
git clone https://github.com/alcadox/Proyecto-Final-Desarrollo-de-Interfaces-React-Gestion-Gimnasio.git
cd Proyecto-Final-Desarrollo-de-Interfaces-React-Gestion-Gimnasio
```
### 2. Configurar el Backend 🖥️
```bash
# Entrar a la carpeta del servidor

cd servidor
cd server
npm install
```
Crea la base de datos en MySQL con el docker-compose.yml ubicada en /servidor.

Importa el archivo .sql proporcionado en la carpeta.
```bash
# Inicia el servidor:

node app.js
```

### 3. Configurar el Frontend ⚡
```bash
# Abrir una nueva terminal
cd gestorGimnasio
npm install
```
Inicia el entorno de desarrollo con Vite:
```bash
npm run dev
```
# 📐 Lógica de Validación de DNI
El sistema cuenta con una validación matemática estricta para DNIs españoles, asegurando la integridad de los datos:

```javaScript

// Ejemplo del algoritmo implementado
const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
const numero = parseInt(dni.substring(0, 8), 10);
const letraCorrecta = letras[numero % 23];
```
📂 Estructura del Proyecto
```plaintext

├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes reutilizables (Botones, Cards, Menu)
│   │   ├── routes/      # Vistas principales (Clientes, Entrenadores, Editar)
│   │   └── styles/      # CSS personalizado
│   └── vite.config.js   # Configuración de Vite
├── backend/
│   ├── uploads/         # Fotos de perfil almacenadas
│   └── app.js           # API Rest con Express y MySQL
└── database/
    └── script.sql       # Esquema y datos iniciales
```
👤 Autor
Desarrollado con ❤️ por [alcadox].

Github: @alcadox

⭐ ¡Si este proyecto te parece útil, no olvides darle una estrella en GitHub!
