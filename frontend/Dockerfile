# ---- Etapa 1: Construcción (Builder) ----
# Usamos una imagen oficial de Node.js como base.
# 'alpine' es una versión ligera de Linux, ideal para mantener las imágenes pequeñas.
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json (o yarn.lock)
# Esto aprovecha el caché de Docker. Si no cambian, no se reinstalan las dependencias.
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto del código fuente de la aplicación
COPY . .

# Creamos la build de producción. Vite pondrá los archivos en la carpeta /dist
RUN npm run build

# ---- Etapa 2: Producción (Server) ----
# Usamos una imagen oficial de Nginx, que es un servidor web muy ligero y eficiente.
FROM nginx:stable-alpine

# Copiamos los archivos estáticos generados en la etapa anterior 
# desde la carpeta /app/dist del 'builder' al directorio por defecto de Nginx.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos nuestro archivo de configuración personalizado de Nginx.
# Esto es crucial para que el enrutamiento de React funcione correctamente.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80, que es el puerto por defecto de Nginx.
EXPOSE 80

# Comando para iniciar Nginx cuando el contenedor se ejecute.
CMD ["nginx", "-g", "daemon off;"]