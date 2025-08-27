# 🖥️ Comandos Bash para Academia de Heróis

## 🚀 Comandos de Execução Rápida

### Comando Principal (Recomendado)
```bash
# Navegar para o projeto e executar tudo automaticamente
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado && ./update_project.sh
```

### Comando de Configuração Inicial
```bash
# Para primeira execução (instala tudo do zero)
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado && ./setup_project.sh
```

## 📦 Comandos de Instalação

### Instalar Dependências Node.js
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
npm install
npm install cors sqlite3
```

### Instalar SASS (se necessário)
```bash
npm install -g sass
```

## 🎨 Comandos de Compilação

### Compilar SCSS para CSS
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
sass styles.scss styles_compiled.css --no-source-map
```

### Compilar SCSS em modo watch (atualização automática)
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
sass --watch styles.scss:styles_compiled.css
```

## 🐍 Comandos Python

### Executar Módulo de Missões
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
python3 missions.py
```

### Verificar Versão do Python
```bash
python3 --version
```

## 🚀 Comandos do Servidor

### Iniciar Servidor (Foreground)
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
node server_improved.js
```

### Iniciar Servidor (Background)
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
nohup node server_improved.js > server.log 2>&1 &
```

### Parar Servidor em Background
```bash
# Encontrar o processo
ps aux | grep "node server_improved.js"

# Parar pelo PID (substitua XXXX pelo PID encontrado)
kill XXXX
```

### Ver Logs do Servidor
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
tail -f server.log
```

## 💾 Comandos de Banco de Dados

### Fazer Backup do Banco
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
cp database.sqlite database_backup_$(date +%Y%m%d_%H%M%S).sqlite
```

### Remover Banco (para recriar)
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
rm -f database.sqlite
```

### Listar Backups
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
ls -la database_backup_*.sqlite
```

## 🔍 Comandos de Verificação

### Verificar Status do Servidor
```bash
# Verificar se está rodando na porta 3001
netstat -tulpn | grep 3001

# Ou verificar processos Node.js
ps aux | grep node
```

### Testar Conectividade
```bash
# Testar se o servidor responde
curl http://localhost:3001

# Testar API
curl http://localhost:3001/api/heroes
```

### Verificar Estrutura do Projeto
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
ls -la
```

## 🧹 Comandos de Limpeza

### Limpar node_modules e Reinstalar
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
rm -rf node_modules
npm install
npm install cors sqlite3
```

### Limpar Logs
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
rm -f server.log
rm -f nohup.out
```

### Limpar Arquivos Temporários
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
rm -f *.tmp
rm -f *.log
```

## 📊 Comandos de Monitoramento

### Monitorar Uso de CPU e Memória
```bash
# Ver processos Node.js
top -p $(pgrep node)

# Ou usar htop se disponível
htop -p $(pgrep node)
```

### Verificar Espaço em Disco
```bash
df -h
du -sh /home/ubuntu/Projeto-Final-CRUD-Gamificado
```

### Monitorar Logs em Tempo Real
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
tail -f server.log | grep -E "(ERROR|WARN|INFO)"
```

## 🔧 Comandos de Desenvolvimento

### Executar em Modo Debug
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
DEBUG=* node server_improved.js
```

### Verificar Sintaxe JavaScript
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
node -c server_improved.js
node -c game_analytics.js
```

### Verificar Sintaxe Python
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
python3 -m py_compile missions.py
```

## 🌐 Comandos de Rede

### Verificar Portas Abertas
```bash
netstat -tulpn | grep LISTEN
```

### Testar Conectividade Externa (se necessário)
```bash
# Verificar se pode acessar externamente
curl -I http://localhost:3001
```

## 📋 Scripts Personalizados

### Script de Atualização Completa
```bash
#!/bin/bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
git pull  # se usando git
npm install
sass styles.scss styles_compiled.css
python3 missions.py
node server_improved.js
```

### Script de Reset Completo
```bash
#!/bin/bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
pkill -f "node server_improved.js" 2>/dev/null || true
rm -f database.sqlite
rm -rf node_modules
npm install
npm install cors sqlite3
sass styles.scss styles_compiled.css
python3 missions.py
echo "Reset completo realizado!"
```

## 🆘 Comandos de Emergência

### Parar Todos os Processos Node.js
```bash
pkill node
```

### Verificar e Matar Processos na Porta 3001
```bash
# Encontrar processo na porta 3001
lsof -ti:3001

# Matar processo na porta 3001
kill $(lsof -ti:3001)
```

### Reiniciar Serviços (se necessário)
```bash
sudo systemctl restart networking
```

## 📝 Comandos de Logs e Debug

### Ver Últimas 50 Linhas do Log
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
tail -50 server.log
```

### Buscar Erros nos Logs
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
grep -i error server.log
grep -i warn server.log
```

### Criar Log Detalhado
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado
node server_improved.js 2>&1 | tee detailed.log
```

## 🎯 Comandos de Teste

### Teste Rápido de Funcionalidade
```bash
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado

# Iniciar servidor em background
nohup node server_improved.js > test.log 2>&1 &

# Aguardar inicialização
sleep 3

# Testar endpoints
curl -X GET http://localhost:3001/api/heroes
curl -X POST http://localhost:3001/api/heroes \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","class":"Guerreiro"}'

# Parar servidor
kill $(lsof -ti:3001)
```

---

## 💡 Dicas Importantes

1. **Sempre navegue para o diretório do projeto antes de executar comandos**
2. **Use `./update_project.sh` para execução automática completa**
3. **Mantenha backups do banco de dados antes de mudanças importantes**
4. **Monitore os logs para identificar problemas rapidamente**
5. **Use Ctrl+C para parar o servidor quando executado em foreground**

## 🔄 Fluxo de Trabalho Recomendado

```bash
# 1. Navegar para o projeto
cd /home/ubuntu/Projeto-Final-CRUD-Gamificado

# 2. Fazer backup (opcional)
cp database.sqlite database_backup_$(date +%Y%m%d_%H%M%S).sqlite

# 3. Executar projeto
./update_project.sh

# 4. Acessar no navegador: http://localhost:3001

# 5. Para parar: Ctrl+C
```

**🎮 Estes comandos garantem que o projeto funcione perfeitamente!**

