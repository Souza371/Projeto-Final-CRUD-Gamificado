#!/usr/bin/env python3
"""
Módulo Python para gerenciar missões e conquistas do sistema gamificado.
Este módulo adiciona mais funcionalidades em Python para balancear as linguagens.
"""

import sqlite3
import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional

class MissionManager:
    """Gerenciador de missões e conquistas para o sistema gamificado."""
    
    def __init__(self, db_path: str = './database.sqlite'):
        self.db_path = db_path
        self.initialize_database()
    
    def get_connection(self):
        """Obtém uma conexão com o banco de dados."""
        return sqlite3.connect(self.db_path)
    
    def initialize_database(self):
        """Inicializa as tabelas necessárias no banco de dados."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Criar tabela de conquistas se não existir
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS achievements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                icon TEXT,
                hero_id INTEGER,
                earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (hero_id) REFERENCES heroes (id)
            )
        ''')
        
        # Criar tabela de eventos do sistema
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS system_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_type TEXT NOT NULL,
                description TEXT,
                hero_id INTEGER,
                data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (hero_id) REFERENCES heroes (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def generate_daily_missions(self) -> List[Dict]:
        """Gera missões diárias aleatórias."""
        mission_templates = [
            {
                'title': 'Treino Matinal',
                'description': 'Complete 3 ações antes do meio-dia',
                'reward_xp': 150,
                'reward_points': 15,
                'difficulty': 'Normal',
                'type': 'daily'
            },
            {
                'title': 'Explorador Corajoso',
                'description': 'Ganhe 200 XP em uma única sessão',
                'reward_xp': 100,
                'reward_points': 20,
                'difficulty': 'Normal',
                'type': 'daily'
            },
            {
                'title': 'Mestre da Persistência',
                'description': 'Faça login por 3 dias consecutivos',
                'reward_xp': 300,
                'reward_points': 30,
                'difficulty': 'Difícil',
                'type': 'daily'
            },
            {
                'title': 'Colecionador de Pontos',
                'description': 'Acumule 50 pontos em um dia',
                'reward_xp': 200,
                'reward_points': 25,
                'difficulty': 'Normal',
                'type': 'daily'
            }
        ]
        
        # Selecionar 2-3 missões aleatórias
        selected_missions = random.sample(mission_templates, random.randint(2, 3))
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Verificar se já existem missões diárias para hoje
        today = datetime.now().strftime('%Y-%m-%d')
        cursor.execute('''
            SELECT COUNT(*) FROM missions 
            WHERE DATE(created_at) = ? AND difficulty LIKE '%Diária%'
        ''', (today,))
        
        if cursor.fetchone()[0] == 0:
            # Inserir novas missões diárias
            for mission in selected_missions:
                mission['title'] += ' (Diária)'
                mission['difficulty'] += ' - Diária'
                cursor.execute('''
                    INSERT INTO missions (title, description, reward_xp, reward_points, difficulty)
                    VALUES (?, ?, ?, ?, ?)
                ''', (mission['title'], mission['description'], mission['reward_xp'], 
                     mission['reward_points'], mission['difficulty']))
        
        conn.commit()
        conn.close()
        
        return selected_missions
    
    def check_achievements(self, hero_id: int) -> List[Dict]:
        """Verifica e concede conquistas para um herói."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Buscar dados do herói
        cursor.execute('SELECT * FROM heroes WHERE id = ?', (hero_id,))
        hero = cursor.fetchone()
        
        if not hero:
            conn.close()
            return []
        
        hero_dict = {
            'id': hero[0],
            'name': hero[1],
            'class': hero[2],
            'experience': hero[3],
            'level': hero[4],
            'points': hero[5] if len(hero) > 5 else 0
        }
        
        # Definir conquistas possíveis
        achievements = [
            {
                'name': 'Primeiro Passo',
                'description': 'Cadastrou seu primeiro herói',
                'icon': '🎯',
                'condition': lambda h: h['level'] >= 1
            },
            {
                'name': 'Aprendiz Dedicado',
                'description': 'Alcançou o nível 3',
                'icon': '📚',
                'condition': lambda h: h['level'] >= 3
            },
            {
                'name': 'Guerreiro Experiente',
                'description': 'Alcançou o nível 5',
                'icon': '⚔️',
                'condition': lambda h: h['level'] >= 5
            },
            {
                'name': 'Veterano de Guerra',
                'description': 'Alcançou o nível 10',
                'icon': '🛡️',
                'condition': lambda h: h['level'] >= 10
            },
            {
                'name': 'Colecionador',
                'description': 'Acumulou 100 pontos',
                'icon': '💎',
                'condition': lambda h: h['points'] >= 100
            },
            {
                'name': 'Mestre dos Pontos',
                'description': 'Acumulou 500 pontos',
                'icon': '👑',
                'condition': lambda h: h['points'] >= 500
            },
            {
                'name': 'Lenda Viva',
                'description': 'Acumulou 1000 pontos',
                'icon': '🌟',
                'condition': lambda h: h['points'] >= 1000
            }
        ]
        
        new_achievements = []
        
        for achievement in achievements:
            # Verificar se o herói já possui esta conquista
            cursor.execute('''
                SELECT COUNT(*) FROM achievements 
                WHERE hero_id = ? AND name = ?
            ''', (hero_id, achievement['name']))
            
            if cursor.fetchone()[0] == 0 and achievement['condition'](hero_dict):
                # Conceder conquista
                cursor.execute('''
                    INSERT INTO achievements (name, description, icon, hero_id)
                    VALUES (?, ?, ?, ?)
                ''', (achievement['name'], achievement['description'], 
                     achievement['icon'], hero_id))
                
                new_achievements.append(achievement)
                
                # Registrar evento
                self.log_event('achievement_earned', f"Conquista '{achievement['name']}' obtida", hero_id, {
                    'achievement_name': achievement['name'],
                    'achievement_icon': achievement['icon']
                })
        
        conn.commit()
        conn.close()
        
        return new_achievements
    
    def get_hero_achievements(self, hero_id: int) -> List[Dict]:
        """Obtém todas as conquistas de um herói."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT name, description, icon, earned_at 
            FROM achievements 
            WHERE hero_id = ? 
            ORDER BY earned_at DESC
        ''', (hero_id,))
        
        achievements = []
        for row in cursor.fetchall():
            achievements.append({
                'name': row[0],
                'description': row[1],
                'icon': row[2],
                'earned_at': row[3]
            })
        
        conn.close()
        return achievements
    
    def log_event(self, event_type: str, description: str, hero_id: Optional[int] = None, data: Optional[Dict] = None):
        """Registra um evento no sistema."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        data_json = json.dumps(data) if data else None
        
        cursor.execute('''
            INSERT INTO system_events (event_type, description, hero_id, data)
            VALUES (?, ?, ?, ?)
        ''', (event_type, description, hero_id, data_json))
        
        conn.commit()
        conn.close()
    
    def get_system_stats(self) -> Dict:
        """Obtém estatísticas do sistema."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        stats = {}
        
        # Total de heróis
        cursor.execute('SELECT COUNT(*) FROM heroes')
        stats['total_heroes'] = cursor.fetchone()[0]
        
        # Total de conquistas obtidas
        cursor.execute('SELECT COUNT(*) FROM achievements')
        stats['total_achievements'] = cursor.fetchone()[0]
        
        # Total de missões completadas
        cursor.execute('SELECT COUNT(*) FROM missions WHERE completed = 1')
        stats['completed_missions'] = cursor.fetchone()[0]
        
        # Herói com mais pontos
        cursor.execute('SELECT name, points FROM heroes ORDER BY points DESC LIMIT 1')
        top_hero = cursor.fetchone()
        if top_hero:
            stats['top_hero'] = {'name': top_hero[0], 'points': top_hero[1]}
        else:
            stats['top_hero'] = {'name': 'Nenhum', 'points': 0}
        
        # Eventos recentes
        cursor.execute('''
            SELECT event_type, description, created_at 
            FROM system_events 
            ORDER BY created_at DESC 
            LIMIT 5
        ''')
        
        stats['recent_events'] = []
        for row in cursor.fetchall():
            stats['recent_events'].append({
                'type': row[0],
                'description': row[1],
                'created_at': row[2]
            })
        
        conn.close()
        return stats
    
    def calculate_hero_score(self, hero_id: int) -> int:
        """Calcula a pontuação total de um herói baseada em múltiplos fatores."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Buscar dados do herói
        cursor.execute('SELECT * FROM heroes WHERE id = ?', (hero_id,))
        hero = cursor.fetchone()
        
        if not hero:
            conn.close()
            return 0
        
        base_points = hero[5] if len(hero) > 5 else 0
        level_bonus = hero[4] * 10  # 10 pontos por nível
        xp_bonus = hero[3] // 50    # 1 ponto a cada 50 XP
        
        # Bônus por conquistas
        cursor.execute('SELECT COUNT(*) FROM achievements WHERE hero_id = ?', (hero_id,))
        achievement_bonus = cursor.fetchone()[0] * 25  # 25 pontos por conquista
        
        # Bônus por missões completadas
        cursor.execute('SELECT COUNT(*) FROM missions WHERE hero_id = ? AND completed = 1', (hero_id,))
        mission_bonus = cursor.fetchone()[0] * 15  # 15 pontos por missão
        
        total_score = base_points + level_bonus + xp_bonus + achievement_bonus + mission_bonus
        
        conn.close()
        return total_score

def main():
    """Função principal para testes."""
    manager = MissionManager()
    
    # Gerar missões diárias
    daily_missions = manager.generate_daily_missions()
    print("Missões diárias geradas:", len(daily_missions))
    
    # Obter estatísticas do sistema
    stats = manager.get_system_stats()
    print("Estatísticas do sistema:", json.dumps(stats, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()

