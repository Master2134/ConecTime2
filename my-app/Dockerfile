FROM node:20-alpine

WORKDIR /app

# Instala dependências de produção e desenvolvimento
COPY package*.json ./
RUN npm ci

# Copia o código da aplicação
COPY . .

EXPOSE 3000

# O comando real é definido no docker-compose (npm run dev)
CMD ["npm", "run", "dev"]