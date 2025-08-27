/**
 * Módulo JavaScript para análise de dados e métricas do jogo
 * Este módulo adiciona funcionalidades avançadas em JavaScript para balancear as linguagens
 */

class GameAnalytics {
    constructor() {
        this.sessionStart = Date.now();
        this.actions = [];
        this.metrics = {
            totalClicks: 0,
            totalTimeSpent: 0,
            heroesCreated: 0,
            xpGained: 0,
            pointsEarned: 0,
            missionsCompleted: 0
        };
        this.initializeTracking();
    }

    /**
     * Inicializa o rastreamento de eventos
     */
    initializeTracking() {
        // Rastrear cliques
        document.addEventListener('click', (event) => {
            this.trackAction('click', {
                element: event.target.tagName,
                className: event.target.className,
                id: event.target.id,
                timestamp: Date.now()
            });
            this.metrics.totalClicks++;
        });

        // Rastrear tempo na página
        setInterval(() => {
            this.metrics.totalTimeSpent = Date.now() - this.sessionStart;
        }, 1000);

        // Rastrear quando o usuário sai da página
        window.addEventListener('beforeunload', () => {
            this.saveSessionData();
        });

        // Carregar dados salvos
        this.loadSessionData();
    }

    /**
     * Rastreia uma ação do usuário
     */
    trackAction(actionType, data) {
        const action = {
            type: actionType,
            data: data,
            timestamp: Date.now(),
            sessionTime: Date.now() - this.sessionStart
        };
        
        this.actions.push(action);
        
        // Manter apenas as últimas 100 ações para não sobrecarregar a memória
        if (this.actions.length > 100) {
            this.actions.shift();
        }
    }

    /**
     * Analisa padrões de uso
     */
    analyzeUsagePatterns() {
        const patterns = {
            mostClickedElements: this.getMostClickedElements(),
            averageSessionTime: this.getAverageSessionTime(),
            actionsPerMinute: this.getActionsPerMinute(),
            peakUsageHours: this.getPeakUsageHours(),
            userEngagement: this.calculateEngagement()
        };

        return patterns;
    }

    /**
     * Obtém os elementos mais clicados
     */
    getMostClickedElements() {
        const elementCounts = {};
        
        this.actions
            .filter(action => action.type === 'click')
            .forEach(action => {
                const element = action.data.element;
                elementCounts[element] = (elementCounts[element] || 0) + 1;
            });

        return Object.entries(elementCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([element, count]) => ({ element, count }));
    }

    /**
     * Calcula o tempo médio de sessão
     */
    getAverageSessionTime() {
        const sessions = this.getStoredSessions();
        if (sessions.length === 0) return 0;

        const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
        return Math.round(totalTime / sessions.length / 1000); // em segundos
    }

    /**
     * Calcula ações por minuto
     */
    getActionsPerMinute() {
        const sessionTimeMinutes = (Date.now() - this.sessionStart) / 60000;
        return sessionTimeMinutes > 0 ? Math.round(this.actions.length / sessionTimeMinutes) : 0;
    }

    /**
     * Identifica horários de pico de uso
     */
    getPeakUsageHours() {
        const hourCounts = {};
        
        this.actions.forEach(action => {
            const hour = new Date(action.timestamp).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        return Object.entries(hourCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([hour, count]) => ({ hour: parseInt(hour), count }));
    }

    /**
     * Calcula o nível de engajamento do usuário
     */
    calculateEngagement() {
        const sessionTimeMinutes = (Date.now() - this.sessionStart) / 60000;
        const actionsPerMinute = this.getActionsPerMinute();
        
        let engagementLevel = 'Baixo';
        
        if (sessionTimeMinutes > 5 && actionsPerMinute > 2) {
            engagementLevel = 'Alto';
        } else if (sessionTimeMinutes > 2 || actionsPerMinute > 1) {
            engagementLevel = 'Médio';
        }

        return {
            level: engagementLevel,
            sessionTime: Math.round(sessionTimeMinutes),
            actionsPerMinute: actionsPerMinute,
            score: Math.round((sessionTimeMinutes * actionsPerMinute) / 10)
        };
    }

    /**
     * Gera relatório de desempenho
     */
    generatePerformanceReport() {
        const report = {
            session: {
                startTime: new Date(this.sessionStart).toLocaleString('pt-BR'),
                duration: Math.round((Date.now() - this.sessionStart) / 1000),
                totalActions: this.actions.length
            },
            metrics: this.metrics,
            patterns: this.analyzeUsagePatterns(),
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    /**
     * Gera recomendações baseadas no uso
     */
    generateRecommendations() {
        const recommendations = [];
        const engagement = this.calculateEngagement();

        if (engagement.level === 'Baixo') {
            recommendations.push('Tente explorar mais funcionalidades do sistema');
            recommendations.push('Considere criar mais heróis para aumentar a diversão');
        }

        if (this.metrics.xpGained < 100) {
            recommendations.push('Complete mais missões para ganhar experiência');
        }

        if (this.metrics.heroesCreated === 0) {
            recommendations.push('Crie seu primeiro herói para começar a aventura');
        }

        if (this.metrics.totalClicks > 50) {
            recommendations.push('Você está muito ativo! Continue assim!');
        }

        return recommendations;
    }

    /**
     * Salva dados da sessão no localStorage
     */
    saveSessionData() {
        const sessionData = {
            startTime: this.sessionStart,
            endTime: Date.now(),
            duration: Date.now() - this.sessionStart,
            metrics: this.metrics,
            actions: this.actions.slice(-20) // Salvar apenas as últimas 20 ações
        };

        const sessions = this.getStoredSessions();
        sessions.push(sessionData);

        // Manter apenas as últimas 10 sessões
        if (sessions.length > 10) {
            sessions.shift();
        }

        localStorage.setItem('gameAnalytics_sessions', JSON.stringify(sessions));
    }

    /**
     * Carrega dados de sessões anteriores
     */
    loadSessionData() {
        const sessions = this.getStoredSessions();
        
        if (sessions.length > 0) {
            const lastSession = sessions[sessions.length - 1];
            
            // Se a última sessão foi há menos de 1 hora, considerar como continuação
            if (Date.now() - lastSession.endTime < 3600000) {
                this.metrics = { ...this.metrics, ...lastSession.metrics };
            }
        }
    }

    /**
     * Obtém sessões armazenadas
     */
    getStoredSessions() {
        try {
            const stored = localStorage.getItem('gameAnalytics_sessions');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erro ao carregar dados de sessão:', error);
            return [];
        }
    }

    /**
     * Atualiza métricas específicas
     */
    updateMetric(metricName, value) {
        if (this.metrics.hasOwnProperty(metricName)) {
            this.metrics[metricName] += value;
            this.trackAction('metric_update', { metric: metricName, value: value });
        }
    }

    /**
     * Obtém estatísticas em tempo real
     */
    getRealTimeStats() {
        return {
            currentSession: {
                duration: Math.round((Date.now() - this.sessionStart) / 1000),
                actions: this.actions.length,
                engagement: this.calculateEngagement()
            },
            allTime: this.metrics,
            lastActions: this.actions.slice(-5)
        };
    }

    /**
     * Exporta dados para análise externa
     */
    exportData() {
        const exportData = {
            sessions: this.getStoredSessions(),
            currentSession: {
                startTime: this.sessionStart,
                metrics: this.metrics,
                actions: this.actions
            },
            report: this.generatePerformanceReport()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `game_analytics_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Limpa todos os dados armazenados
     */
    clearData() {
        localStorage.removeItem('gameAnalytics_sessions');
        this.actions = [];
        this.metrics = {
            totalClicks: 0,
            totalTimeSpent: 0,
            heroesCreated: 0,
            xpGained: 0,
            pointsEarned: 0,
            missionsCompleted: 0
        };
    }
}

// Classe para visualização de dados
class AnalyticsVisualizer {
    constructor(analytics) {
        this.analytics = analytics;
    }

    /**
     * Cria um gráfico simples de barras em ASCII
     */
    createBarChart(data, title) {
        const maxValue = Math.max(...data.map(item => item.value));
        const maxBarLength = 20;
        
        let chart = `\n${title}\n${'='.repeat(title.length)}\n`;
        
        data.forEach(item => {
            const barLength = Math.round((item.value / maxValue) * maxBarLength);
            const bar = '█'.repeat(barLength) + '░'.repeat(maxBarLength - barLength);
            chart += `${item.label.padEnd(15)} |${bar}| ${item.value}\n`;
        });
        
        return chart;
    }

    /**
     * Gera dashboard em texto
     */
    generateTextDashboard() {
        const stats = this.analytics.getRealTimeStats();
        const patterns = this.analytics.analyzeUsagePatterns();
        
        let dashboard = '\n🎮 DASHBOARD DE ANÁLISE DO JOGO 🎮\n';
        dashboard += '=' .repeat(40) + '\n\n';
        
        dashboard += '📊 SESSÃO ATUAL:\n';
        dashboard += `⏱️  Duração: ${stats.currentSession.duration}s\n`;
        dashboard += `🖱️  Ações: ${stats.currentSession.actions}\n`;
        dashboard += `💪 Engajamento: ${stats.currentSession.engagement.level}\n\n`;
        
        dashboard += '📈 MÉTRICAS TOTAIS:\n';
        dashboard += `👥 Heróis criados: ${stats.allTime.heroesCreated}\n`;
        dashboard += `⭐ XP ganho: ${stats.allTime.xpGained}\n`;
        dashboard += `💎 Pontos: ${stats.allTime.pointsEarned}\n`;
        dashboard += `🎯 Missões: ${stats.allTime.missionsCompleted}\n\n`;
        
        if (patterns.mostClickedElements.length > 0) {
            const chartData = patterns.mostClickedElements.map(item => ({
                label: item.element,
                value: item.count
            }));
            dashboard += this.createBarChart(chartData, '🖱️ ELEMENTOS MAIS CLICADOS');
        }
        
        return dashboard;
    }

    /**
     * Mostra dashboard no console
     */
    showDashboard() {
        console.log(this.generateTextDashboard());
    }
}

// Inicialização global
let gameAnalytics;
let analyticsVisualizer;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    gameAnalytics = new GameAnalytics();
    analyticsVisualizer = new AnalyticsVisualizer(gameAnalytics);
    
    // Adicionar botão de analytics no header (se não existir)
    const header = document.querySelector('header');
    if (header && !document.getElementById('analyticsBtn')) {
        const analyticsBtn = document.createElement('button');
        analyticsBtn.id = 'analyticsBtn';
        analyticsBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Analytics';
        analyticsBtn.className = 'btn btn-primary';
        analyticsBtn.style.position = 'absolute';
        analyticsBtn.style.top = '10px';
        analyticsBtn.style.right = '10px';
        analyticsBtn.style.fontSize = '0.8rem';
        analyticsBtn.style.padding = '8px 12px';
        
        analyticsBtn.onclick = function() {
            showAnalyticsModal();
        };
        
        header.style.position = 'relative';
        header.appendChild(analyticsBtn);
    }
    
    console.log('🎮 Game Analytics inicializado!');
    console.log('💡 Digite "gameAnalytics.generatePerformanceReport()" no console para ver relatório completo');
    console.log('📊 Digite "analyticsVisualizer.showDashboard()" para ver dashboard');
});

// Função para mostrar modal de analytics
function showAnalyticsModal() {
    const report = gameAnalytics.generatePerformanceReport();
    const dashboard = analyticsVisualizer.generateTextDashboard();
    
    // Criar modal se não existir
    let modal = document.getElementById('analyticsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'analyticsModal';
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3><i class="fas fa-chart-bar"></i> Analytics do Jogo</h3>
                    <button class="close-modal" onclick="closeAnalyticsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="analyticsContent" style="font-family: monospace; white-space: pre-wrap; font-size: 0.9rem;">
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button class="btn btn-primary" onclick="gameAnalytics.exportData()">
                        <i class="fas fa-download"></i> Exportar Dados
                    </button>
                    <button class="btn btn-danger" onclick="gameAnalytics.clearData(); closeAnalyticsModal();">
                        <i class="fas fa-trash"></i> Limpar Dados
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('analyticsContent').textContent = dashboard;
    modal.style.display = 'block';
}

// Função para fechar modal de analytics
function closeAnalyticsModal() {
    const modal = document.getElementById('analyticsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Integração com eventos do jogo
function trackHeroCreation() {
    if (gameAnalytics) {
        gameAnalytics.updateMetric('heroesCreated', 1);
        gameAnalytics.trackAction('hero_created', { timestamp: Date.now() });
    }
}

function trackXPGain(amount) {
    if (gameAnalytics) {
        gameAnalytics.updateMetric('xpGained', amount);
        gameAnalytics.trackAction('xp_gained', { amount: amount, timestamp: Date.now() });
    }
}

function trackPointsEarned(amount) {
    if (gameAnalytics) {
        gameAnalytics.updateMetric('pointsEarned', amount);
        gameAnalytics.trackAction('points_earned', { amount: amount, timestamp: Date.now() });
    }
}

function trackMissionCompleted() {
    if (gameAnalytics) {
        gameAnalytics.updateMetric('missionsCompleted', 1);
        gameAnalytics.trackAction('mission_completed', { timestamp: Date.now() });
    }
}

// Exportar para uso global
window.gameAnalytics = gameAnalytics;
window.analyticsVisualizer = analyticsVisualizer;
window.trackHeroCreation = trackHeroCreation;
window.trackXPGain = trackXPGain;
window.trackPointsEarned = trackPointsEarned;
window.trackMissionCompleted = trackMissionCompleted;

