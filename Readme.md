Gestor de Tareas Fullstack
Este proyecto es un gestor de tareas completo, con un backend robusto construido con NestJS (Node.js) y una API RESTful, y un frontend dinámico desarrollado con React (Vite). Utiliza Docker Compose para una configuración de desarrollo y producción sencilla y consistente.

🚀 Instalación y Configuración
Sigue estos pasos para poner el proyecto en marcha en tu máquina local.

## ⚙️ Prerrequisitos

Asegúrate de tener instalado lo siguiente:

Docker Desktop: Incluye Docker Engine y Docker Compose. Puedes descargarlo desde docker.com.

## 1.- Clonar el Repositorio

Primero, clona el repositorio a tu máquina local:

git clone https://github.com/JDevpy/gestor-tareas-fullstack
cd gestor-tareas-fullstack

---

## ⚙️ Variables de Entorno Necesarias

## 2.-Crear Archivos .env

Aquí se detallan las variables de entorno utilizadas en el proyecto. Asegúrate de configurarlas correctamente en los archivos `.env` apropiados, en caso de que no existan, deben crearse.

### En `.env` (raíz del proyecto, para Docker Compose)

Este archivo es leído por Docker Compose y define las variables que se pasan a los contenedores.

- PORT=3000
- FRONTEND_URL=http://localhost:5173
- DB_HOST=db
- DB_PORT=5432
- DB_DATABASE=tododb
- DB_USERNAME=user
- DB_PASSWORD=password

### En `backend/.env` (para el servicio NestJS)

Este archivo es utilizado por la aplicación NestJS misma. Las variables aquí pueden ser sobrescritas por las pasadas por Docker Compose en el entorno del contenedor. Es útil para desarrollo local sin Docker.

- PORT=${PORT}
- FRONTEND_URL=${FRONTEND_URL}
- DATABASE_URL=postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public

### En `frontend/.env` (para el servicio React/Vite)

Este archivo es utilizado por Vite para exponer variables de entorno al código del frontend en el navegador. **Todas las variables destinadas al frontend deben comenzar con `VITE_`**.

- VITE_API_BASE_URL=http://localhost:${PORT}/api

---

💻 Construcción y Ejecución con Docker Compose

## 3.-Instalar Dependencias de Node.js:

Luego de crear los archivos .env en los directorios indicados se deben instalar las dependencias de Node.js:
Navega tanto a los directorios backend como frontend e instala sus respectivas dependencias:

## Para el backend:

cd backend
npm install
cd ..

## Para el frontend:

cd frontend
npm install
cd ..

## 4.-Generar Archivos de Distribución (Dist):

Luego, crea los archivos dist listos para producción tanto para el frontend como para el backend. Esto es crucial para que Docker construya las imágenes correctamente.

## Para el backend:

cd backend
npm run build
cd ..

## Para el frontend:

cd frontend
npm run build
cd ..

## 5.-Ejecutar Docker Compose:

Una vez configurado, puedes levantar todo el stack con un solo comando(Recuerda que debes estar en la carpeta raíz del proyecto):

docker compose up --build

💻 Comandos de Ejecución
Aquí están los comandos principales para interactuar con tu aplicación.

- Docker Compose Comandos

Iniciar todos los servicios (y construir si es necesario):

- docker compose up --build

Iniciar todos los servicios (usando imágenes existentes):

- docker compose up

Detener todos los servicios (sin eliminar datos):

- docker compose stop

Detener y eliminar contenedores, redes y volúmenes (limpieza completa):

- docker compose down -v

Reconstruir un servicio específico (ej. frontend):

- docker compose build --no-cache frontend

Ver logs de todos los servicios:

- docker compose logs -f

Ejecutar un comando dentro de un contenedor (ej. entrar al shell del backend):

- docker compose exec backend sh

---

📂 Estructura del Proyecto
El repositorio está organizado en dos directorios principales, uno para el backend y otro para el frontend, junto con los archivos de configuración de Docker en la raíz.

.
├── Backend/
│ ├── src/
│ │ ├── tags/
│ │ │ ├── tags.controller.spec.ts
│ │ │ ├── tags.controller.ts
│ │ │ └── tags.module.ts
│ │ ├── tasks/
│ │ │ ├── dto/
│ │ │ │ ├── create-tasks.dto.ts
│ │ │ │ ├── get-tasks-filter.dto.ts
│ │ │ │ └── update-tasks.dto.ts
│ │ │ ├── tasks.model.ts
│ │ │ ├── tasks.controller.spec.ts
│ │ │ ├── tasks.controller.ts
│ │ │ ├── tasks.module.ts
│ │ │ ├── tasks.service.spec.ts
│ │ │ └── tasks.service.ts
│ │ ├── app.controler.spec.ts
│ │ ├── app.controler.ts
│ │ ├── app.module.ts
│ │ ├── app.service.ts
│ │ └── main.ts
│ ├── test/
│ │ ├── app.e2e-spec.ts
│ │ └── jest-e2e.json
│ ├── Dockerfile
│ ├── nest-cli.json
│ ├── package-lock.json
│ ├── package.json
│ ├── tsconfig.build.json
│ └── tsconfig.json
├── Frontend/
│ ├── public/
│ │ └── favicon.png
│ └── src/
│ ├── api/
│ │ └── taskApi.ts
│ ├── app/
│ │ └── store.ts
│ ├── features/
│ │ ├── tags/
│ │ │ └── tagsSlice.ts
│ │ └── tasks/
│ │ ├── components
│ │ ├── TaskForm.tsx
│ │ ├── TaskList.tsx
│ │ └── taskSlice.tsx
│ ├── hooks/
│ │ └── hooks.ts
│ ├── layouts/
│ │ └── MainLayout.ts
│ ├── pages/
│ │ ├── Home.tsx
│ │ └── NotFound.tsx
│ ├── routes/
│ │ └── index.tsx
│ ├── style/
│ │ ├── App.css
│ │ └── index.css
│ ├── types/
│ │ └── taskTypes.ts
│ ├── App.tsx
│ ├── main.tsx
│ ├── setupTest.ts
│ ├── vite-env.d.ts
│ ├── Dockerfile
│ ├── tailwind.config.js
│ ├── tsconfig.app.json
│ ├── tsconfig.json
│ └── tsconfig.node.json
├── db_data
├── .env
├── docker-compose.yml
└── Readme.md
