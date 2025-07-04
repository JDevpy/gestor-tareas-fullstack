import { Injectable } from '@nestjs/common'; // Decorador para marcar una clase como inyectable

@Injectable() // Indica que esta clase puede ser inyectada como dependencia en otros componentes.
export class AppService {
  // Define un método simple que devuelve una cadena de texto.
  // Este es un ejemplo básico y a menudo se usa para la ruta raíz o para pruebas iniciales.
  getHello(): string {
    return 'Hello World!';
  }
}