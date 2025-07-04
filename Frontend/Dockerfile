# Dockerfile
# Este Dockerfile construye una imagen Docker para la aplicación frontend de React.
# Utiliza un enfoque de múltiples etapas para optimizar el tamaño final de la imagen.

# Etapa base (deps): Instala las dependencias del proyecto.
# Se utiliza una imagen ligera de Node.js (versión 20).
FROM node:20-slim AS deps
WORKDIR /app                        
COPY package.json package-lock.json* yarn.lock* ./ 
RUN npm install --include=optional   

# Etapa desarrollo (development): Configura el entorno para desarrollo local.
# Basada en la etapa 'deps', copia todo el código y expone el puerto de desarrollo.
FROM deps AS development
WORKDIR /app                         
COPY . .                             
EXPOSE 5173                           
CMD ["npm", "run", "dev"]            

# Etapa build (build): Construye la aplicación para producción.
# Basada en la etapa 'deps' (para tener las dependencias), copia el código y ejecuta el build.
FROM deps AS build
WORKDIR /app                          
COPY . .                              
RUN npm run build                    

# Etapa producción (production): Sirve la aplicación construida.
# Utiliza una imagen ligera de Node.js, copia solo los archivos de la build y usa 'serve'.
FROM node:20-slim AS production
WORKDIR /app                          
# Copia los archivos estáticos generados en la etapa 'build' a la carpeta 'dist' de esta etapa.
COPY --from=build /app/dist ./dist
RUN npm install -g serve              
EXPOSE 5173                           
CMD ["serve", "-s", "dist", "-l", "5173"] 