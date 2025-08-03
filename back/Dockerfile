# Use uma imagem base do Node.js
FROM node:16

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Instale o MongoDB Database Tools (mongodump)
RUN apt-get update && apt-get install -y mongodb-org-tools

# Copie o package.json e o yarn.lock para o contêiner
COPY package.json yarn.lock ./

# Instale as dependências usando o Yarn
RUN yarn install

# Copie o restante da aplicação para o contêiner
COPY . .

# Exponha a porta onde a aplicação estará rodando
EXPOSE 3000

# Comando para iniciar a aplicação (ajuste conforme o seu script de start)
CMD ["yarn", "start"]
