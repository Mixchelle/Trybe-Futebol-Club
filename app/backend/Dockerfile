# Usar a imagem node:16.14-alpine como base
FROM node:16.14-alpine

# Mudar para o diretório de trabalho /app-backend
WORKDIR /app-backend

# Copiar os package.json e package-lock.json para o container
COPY package*.json ./

# Instalar as dependências Node
RUN npm install

# Copiar o restante dos arquivos da aplicação para o container
COPY . .

# Sinalize que a aplicação expõe a porta 3001
EXPOSE 3001

# Configurar o comando para iniciar a aplicação de acordo com as boas práticas
CMD ["npm", "start"]
