# Utilizar Node.js como imagen base
FROM node:18-alpine

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar el package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalar todas las dependencias
RUN npm install

# Instalar ts-node globalmente para ejecutar TypeScript sin compilar a JS
RUN npm install -g ts-node typescript

# Copiar todos los archivos del proyecto a /app
COPY . .

# Exponer el puerto que utiliza la aplicación (puerto 3000 en este caso)
EXPOSE 3000

# Ejecutar la aplicación con ts-node, buscando el archivo main.ts en src
CMD ["ts-node", "src/main.ts"]
