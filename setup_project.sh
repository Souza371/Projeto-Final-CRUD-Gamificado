#!/bin/bash

# Navega para o diretório do projeto
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado

# Instala as dependências do Node.js
echo "Instalando dependências do Node.js..."
npm install

# Inicia o servidor Node.js
echo "Iniciando o servidor Node.js..."
node server.js

echo "Projeto iniciado. Acesse http://localhost:3001 no seu navegador."


