#!/bin/bash

echo "🎮 Atualizando Academia de Heróis - CRUD Gamificado"
echo "=================================================="

# Navegar para o diretório do projeto
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado

# Verificar se as dependências estão instaladas
echo "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "⬇️ Instalando dependências do Node.js..."
    npm install
fi

# Verificar se as dependências extras estão instaladas
echo "🔧 Verificando dependências extras..."
npm list cors sqlite3 > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⬇️ Instalando dependências extras..."
    npm install cors sqlite3
fi

# Compilar SCSS se necessário
echo "🎨 Compilando estilos SCSS..."
if [ -f "styles.scss" ]; then
    sass styles.scss styles_compiled.css --no-source-map
    echo "✅ Estilos compilados com sucesso!"
fi

# Executar o módulo Python para gerar missões diárias
echo "🐍 Executando módulo Python para missões..."
if [ -f "missions.py" ]; then
    python3 missions.py
    echo "✅ Missões diárias geradas!"
fi

# Fazer backup do banco de dados se existir
if [ -f "database.sqlite" ]; then
    echo "💾 Fazendo backup do banco de dados..."
    cp database.sqlite database_backup_$(date +%Y%m%d_%H%M%S).sqlite
fi

# Iniciar o servidor melhorado
echo "🚀 Iniciando servidor melhorado..."
echo "📊 Servidor rodará em: http://localhost:3001"
echo "🎮 Interface melhorada com:"
echo "   - ✨ Design profissional com cores azul/dourado"
echo "   - 🖼️ Imagem de fundo dos heróis"
echo "   - 💾 Sistema de salvamento robusto (SQLite + localStorage)"
echo "   - 🎯 Sistema de pontos e conquistas"
echo "   - 📊 Analytics em tempo real"
echo "   - 🎨 Estilos SCSS compilados"
echo "   - 🐍 Módulo Python para missões"
echo "   - 📱 Design responsivo"
echo ""
echo "🔧 Tecnologias utilizadas:"
echo "   - Node.js + Express (Backend)"
echo "   - SQLite (Banco de dados)"
echo "   - HTML5 + CSS3 + JavaScript (Frontend)"
echo "   - Python (Módulo de missões)"
echo "   - SCSS (Estilos avançados)"
echo ""
echo "⚡ Pressione Ctrl+C para parar o servidor"
echo "=================================================="

# Executar o servidor melhorado
node server_improved.js

