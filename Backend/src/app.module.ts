import { Module } from '@nestjs/common'; // Decorador fundamental para módulos
import { AppService } from './app.service'; // Servicio base (puede que no se use directamente en rutas)
import { SequelizeModule } from '@nestjs/sequelize'; // Módulo para integrar Sequelize ORM
import { ConfigModule, ConfigService } from '@nestjs/config'; // Módulos para gestionar variables de entorno
import { TasksModule } from './tasks/tasks.module'; // Módulo de las tareas
import { TagsModule } from './tags/tags.module';   // Módulo de las etiquetas

@Module({
  imports: [
    // ConfigModule: Carga variables de entorno desde .env y las hace accesibles globalmente.
    ConfigModule.forRoot({
      isGlobal: true,   // Hace que ConfigModule esté disponible en toda la aplicación
      envFilePath: '.env', // Especifica la ruta del archivo de variables de entorno
    }),
    // SequelizeModule.forRootAsync: Configura la conexión a la base de datos de forma asíncrona.
    // Permite inyectar ConfigService para obtener credenciales de DB desde las variables de entorno.
    SequelizeModule.forRootAsync({
      imports: [ConfigModule], // Importa ConfigModule para poder usar ConfigService
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres', // Tipo de base de datos
        host: configService.get<string>('DB_HOST', 'db'), // Host de la DB (por defecto 'db' para Docker)
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10), // Puerto de la DB
        username: configService.get<string>('DB_USERNAME', 'user'), // Usuario de la DB
        password: configService.get<string>('DB_PASSWORD', 'password'), // Contraseña de la DB
        database: configService.get<string>('DB_DATABASE', 'tododb'), // Nombre de la DB
        autoLoadModels: true, // Carga automáticamente los modelos de Sequelize
        synchronize: true,    // Sincroniza el esquema de la DB con los modelos (¡usar con precaución en producción!)
        logging: false,       // Deshabilita el registro de consultas SQL
      }),
      inject: [ConfigService], // Especifica qué servicios se inyectan en useFactory
    }),
    // Módulos de características: Importa los módulos de tareas y etiquetas,
    // que contienen sus propios controladores, servicios y modelos.
    TasksModule,
    TagsModule,
  ],
  providers: [AppService], // Servicios que están disponibles a nivel global del módulo raíz
})
export class AppModule {}