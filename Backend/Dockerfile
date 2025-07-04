# Usa una imagen base de Node.js
FROM node:18-alpine AS base

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias y el package-lock.json
COPY package.json yarn.lock* package-lock.json* ./

# Instala las dependencias (solo producción, para la imagen final más ligera)
RUN npm install --omit=dev --force

# Etapa de desarrollo: Prepara el entorno para el desarrollo local con watch mode.
FROM base AS development
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install 
COPY . .        
EXPOSE 3000    
CMD ["npm", "run", "start:dev"] 

# Etapa de construcción: Compila la aplicación para producción.
FROM base AS build
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install 
COPY . .        
RUN npm run build 

# Etapa de producción: Crea la imagen final, ligera y lista para desplegar.
FROM node:18-alpine AS production
WORKDIR /app
# Copia solo las dependencias de producción y los archivos compilados de la etapa 'build'.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3000        
CMD ["node", "dist/main"] 