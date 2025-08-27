const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite');
        initializeDatabase();
    }
});

// Inicializar tabelas do banco de dados
function initializeDatabase() {
    const createHeroesTable = `
        CREATE TABLE IF NOT EXISTS heroes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            class TEXT NOT NULL,
            experience INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            points INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    const createMissionsTable = `
        CREATE TABLE IF NOT EXISTS missions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            reward_xp INTEGER DEFAULT 100,
            reward_points INTEGER DEFAULT 10,
            difficulty TEXT DEFAULT 'Normal',
            completed BOOLEAN DEFAULT 0,
            hero_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (hero_id) REFERENCES heroes (id)
        )
    `;
    
    const createAchievementsTable = `
        CREATE TABLE IF NOT EXISTS achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            icon TEXT,
            hero_id INTEGER,
            earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (hero_id) REFERENCES heroes (id)
        )
    `;
    
    db.run(createHeroesTable, (err) => {
        if (err) console.error('Erro ao criar tabela heroes:', err);
        else console.log('✅ Tabela heroes criada/verificada');
    });
    
    db.run(createMissionsTable, (err) => {
        if (err) console.error('Erro ao criar tabela missions:', err);
        else console.log('✅ Tabela missions criada/verificada');
    });
    
    db.run(createAchievementsTable, (err) => {
        if (err) console.error('Erro ao criar tabela achievements:', err);
        else console.log('✅ Tabela achievements criada/verificada');
    });
    
    // Inserir missões padrão se não existirem
    insertDefaultMissions();
}

// Inserir missões padrão
function insertDefaultMissions() {
    const defaultMissions = [
        {
            title: 'Primeira Aventura',
            description: 'Complete seu primeiro cadastro na academia',
            reward_xp: 50,
            reward_points: 5,
            difficulty: 'Fácil'
        },
        {
            title: 'Guerreiro Experiente',
            description: 'Alcance o nível 5',
            reward_xp: 200,
            reward_points: 20,
            difficulty: 'Normal'
        },
        {
            title: 'Mestre dos Pontos',
            description: 'Acumule 100 pontos',
            reward_xp: 300,
            reward_points: 30,
            difficulty: 'Difícil'
        },
        {
            title: 'Lenda Viva',
            description: 'Alcance o nível 10',
            reward_xp: 500,
            reward_points: 50,
            difficulty: 'Épico'
        }
    ];
    
    db.get('SELECT COUNT(*) as count FROM missions', (err, row) => {
        if (err) {
            console.error('Erro ao verificar missões:', err);
            return;
        }
        
        if (row.count === 0) {
            const stmt = db.prepare(`
                INSERT INTO missions (title, description, reward_xp, reward_points, difficulty)
                VALUES (?, ?, ?, ?, ?)
            `);
            
            defaultMissions.forEach(mission => {
                stmt.run([mission.title, mission.description, mission.reward_xp, mission.reward_points, mission.difficulty]);
            });
            
            stmt.finalize();
            console.log('✅ Missões padrão inseridas');
        }
    });
}

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index_improved.html'));
});

// API Routes - Heroes

// Listar todos os heróis
app.get('/api/heroes', (req, res) => {
    const sql = 'SELECT * FROM heroes ORDER BY points DESC, experience DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar heróis:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Buscar herói por ID
app.get('/api/heroes/:id', (req, res) => {
    const sql = 'SELECT * FROM heroes WHERE id = ?';
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            console.error('Erro ao buscar herói:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Herói não encontrado' });
        }
    });
});

// Criar novo herói
app.post('/api/heroes', (req, res) => {
    const { name, class: heroClass, experience = 0, level = 1, points = 0 } = req.body;
    
    if (!name || !heroClass) {
        return res.status(400).json({ error: 'Nome e classe são obrigatórios' });
    }
    
    const sql = `
        INSERT INTO heroes (name, class, experience, level, points)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [name, heroClass, experience, level, points], function(err) {
        if (err) {
            console.error('Erro ao criar herói:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Buscar o herói criado
        db.get('SELECT * FROM heroes WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                console.error('Erro ao buscar herói criado:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json(row);
        });
    });
});

// Atualizar herói
app.put('/api/heroes/:id', (req, res) => {
    const { name, class: heroClass, experience, level, points } = req.body;
    const heroId = req.params.id;
    
    const sql = `
        UPDATE heroes 
        SET name = ?, class = ?, experience = ?, level = ?, points = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    
    db.run(sql, [name, heroClass, experience, level, points, heroId], function(err) {
        if (err) {
            console.error('Erro ao atualizar herói:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (this.changes === 0) {
            res.status(404).json({ error: 'Herói não encontrado' });
            return;
        }
        
        // Buscar o herói atualizado
        db.get('SELECT * FROM heroes WHERE id = ?', [heroId], (err, row) => {
            if (err) {
                console.error('Erro ao buscar herói atualizado:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(row);
        });
    });
});

// Deletar herói
app.delete('/api/heroes/:id', (req, res) => {
    const sql = 'DELETE FROM heroes WHERE id = ?';
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            console.error('Erro ao deletar herói:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (this.changes === 0) {
            res.status(404).json({ error: 'Herói não encontrado' });
            return;
        }
        
        res.json({ message: 'Herói deletado com sucesso' });
    });
});

// API Routes - Missions

// Listar todas as missões
app.get('/api/missions', (req, res) => {
    const sql = `
        SELECT m.*, h.name as hero_name 
        FROM missions m 
        LEFT JOIN heroes h ON m.hero_id = h.id 
        ORDER BY m.created_at DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar missões:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Completar missão
app.post('/api/missions/:id/complete', (req, res) => {
    const { hero_id } = req.body;
    const missionId = req.params.id;
    
    if (!hero_id) {
        return res.status(400).json({ error: 'ID do herói é obrigatório' });
    }
    
    // Buscar a missão
    db.get('SELECT * FROM missions WHERE id = ?', [missionId], (err, mission) => {
        if (err) {
            console.error('Erro ao buscar missão:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!mission) {
            return res.status(404).json({ error: 'Missão não encontrada' });
        }
        
        if (mission.completed) {
            return res.status(400).json({ error: 'Missão já foi completada' });
        }
        
        // Buscar o herói
        db.get('SELECT * FROM heroes WHERE id = ?', [hero_id], (err, hero) => {
            if (err) {
                console.error('Erro ao buscar herói:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            
            if (!hero) {
                return res.status(404).json({ error: 'Herói não encontrado' });
            }
            
            // Atualizar herói com recompensas
            const newExp = hero.experience + mission.reward_xp;
            const newLevel = Math.floor(newExp / 100) + 1;
            const newPoints = hero.points + mission.reward_points;
            
            const updateHeroSql = `
                UPDATE heroes 
                SET experience = ?, level = ?, points = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            db.run(updateHeroSql, [newExp, newLevel, newPoints, hero_id], function(err) {
                if (err) {
                    console.error('Erro ao atualizar herói:', err);
                    res.status(500).json({ error: err.message });
                    return;
                }
                
                // Marcar missão como completada
                const updateMissionSql = `
                    UPDATE missions 
                    SET completed = 1, hero_id = ?
                    WHERE id = ?
                `;
                
                db.run(updateMissionSql, [hero_id, missionId], function(err) {
                    if (err) {
                        console.error('Erro ao atualizar missão:', err);
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    
                    res.json({
                        message: 'Missão completada com sucesso!',
                        rewards: {
                            xp: mission.reward_xp,
                            points: mission.reward_points
                        }
                    });
                });
            });
        });
    });
});

// API Routes - Ranking
app.get('/api/ranking', (req, res) => {
    const sql = `
        SELECT *, 
               ROW_NUMBER() OVER (ORDER BY points DESC, experience DESC) as position
        FROM heroes 
        ORDER BY points DESC, experience DESC 
        LIMIT 10
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar ranking:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API Routes - Estatísticas
app.get('/api/stats', (req, res) => {
    const queries = {
        totalHeroes: 'SELECT COUNT(*) as count FROM heroes',
        totalMissions: 'SELECT COUNT(*) as count FROM missions',
        completedMissions: 'SELECT COUNT(*) as count FROM missions WHERE completed = 1',
        topLevel: 'SELECT MAX(level) as max FROM heroes',
        topExp: 'SELECT MAX(experience) as max FROM heroes',
        topPoints: 'SELECT MAX(points) as max FROM heroes'
    };
    
    const stats = {};
    let completed = 0;
    const total = Object.keys(queries).length;
    
    Object.entries(queries).forEach(([key, sql]) => {
        db.get(sql, [], (err, row) => {
            if (err) {
                console.error(`Erro ao buscar ${key}:`, err);
                stats[key] = 0;
            } else {
                stats[key] = row.count || row.max || 0;
            }
            
            completed++;
            if (completed === total) {
                res.json(stats);
            }
        });
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
    console.log(`📊 API disponível em: http://localhost:${PORT}/api`);
    console.log(`🎮 Academia de Heróis iniciada com sucesso!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando servidor...');
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar banco de dados:', err.message);
        } else {
            console.log('✅ Banco de dados fechado');
        }
        process.exit(0);
    });
});

module.exports = app;

