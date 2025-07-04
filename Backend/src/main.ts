// src/main.ts

import { NestFactory } from '@nestjs/core'; // Función principal para crear una instancia de NestJS
import { AppModule } from './app.module';   // El módulo raíz de tu aplicación

async function bootstrap() {
  // Crea una instancia de la aplicación NestJS usando el AppModule como módulo raíz.
  const app = await NestFactory.create(AppModule);

  // Obtiene la URL del frontend y el puerto del servidor desde las variables de entorno.
  const frontendUrl = process.env.FRONTEND_URL;
  const port = Number(process.env.PORT);

  // Habilita CORS (Cross-Origin Resource Sharing) para permitir que el frontend acceda a la API.
  app.enableCors({
    origin: frontendUrl, // Permite solicitudes solo desde esta URL del frontend.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos.
    credentials: true,   // Permite el envío de cookies y encabezados de autorización.
  });

  // Establece un prefijo global para todas las rutas de la API (ej. /api/tasks, /api/tags).
  app.setGlobalPrefix('api');

  // Verifica que la variable de entorno PORT esté definida.
  if (!port) throw new Error('No se encontró la variable PORT');
  
  // Inicia la aplicación NestJS en el puerto especificado.
  await app.listen(port, () => {
    console.log(`NestJS application is running on: http://localhost:${port}`);
    console.log(`CORS allowed origin(s): ${frontendUrl}`);
  });
}

// Llama a la función bootstrap para iniciar la aplicación.
bootstrap();