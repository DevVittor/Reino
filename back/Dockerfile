# Use uma imagem base do Node.js
FROM node:16-bullseye

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Adicionar o repositório do MongoDB para o Debian Bullseye
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | tee /etc/apt/trusted.gpg.d/mongodb.asc
RUN echo "deb [ arch=amd64,arm64 signed-by=/etc/apt/trusted.gpg.d/mongodb.asc ] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Atualizar pacotes e instalar mongodb-org-tools
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
