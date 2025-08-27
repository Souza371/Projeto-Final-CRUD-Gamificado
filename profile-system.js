// ===== SISTEMA DE PERFIL E ESTATÍSTICAS =====
class ProfileSystem {
    constructor() {
        this.userStats = {
            totalItems: 0,
            completedItems: 0,
            totalPoints: 0,
            averageRating: 0,
            achievements: []
        };
    }

    updateStats(items) {
        this.userStats.totalItems = items.length;
        this.userStats.completedItems = items.filter(item => item.completed).length;
        this.userStats.totalPoints = items.reduce((sum, item) => sum + (item.points || 0), 0);
        
        const ratedItems = items.filter(item => item.stars > 0);
        this.userStats.averageRating = ratedItems.length > 0 
            ? (ratedItems.reduce((sum, item) => sum + item.stars, 0) / ratedItems.length).toFixed(1)
            : 0;

        this.checkAchievements();
        this.renderProfile();
    }

    checkAchievements() {
        this.userStats.achievements = [];
        
        if (this.userStats.totalItems >= 1) {
            this.userStats.achievements.push('🎯 Primeiro Item');
        }
        if (this.userStats.totalItems >= 5) {
            this.userStats.achievements.push('🏆 Colecionador');
        }
        if (this.userStats.totalPoints >= 50) {
            this.userStats.achievements.push('⭐ Mestre dos Pontos');
        }
        if (this.userStats.completedItems >= 3) {
            this.userStats.achievements.push('✅ Finalizador');
        }
        if (this.userStats.averageRating >= 4) {
            this.userStats.achievements.push('👍 Qualidade Premium');
        }
    }

    renderProfile() {
        const profileContainer = document.getElementById('user-profile');
        if (!profileContainer) return;

        let achievementsHTML = '';
        if (this.userStats.achievements.length > 0) {
            achievementsHTML = `
                <div class="mt-3">
                    <h5>🏆 Conquistas</h5>
                    <div class="d-flex flex-wrap gap-2">
                        ${this.userStats.achievements.map(ach => `
                            <span class="badge bg-success">${ach}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        profileContainer.innerHTML = `
            <div class="user-profile fade-in">
                <h3>👤 Meu Perfil</h3>
                <div class="profile-stats">
                    <div class="stat-box">
                        <span class="stat-number">${this.userStats.totalItems}</span>
                        <span>Itens</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${this.userStats.completedItems}</span>
                        <span>Concluídos</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${this.userStats.totalPoints}</span>
                        <span>Pontos</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${this.userStats.averageRating}</span>
                        <span>Avaliação</span>
                    </div>
                </div>
                ${achievementsHTML}
            </div>
        `;
    }

    getStats() {
        return this.userStats;
    }
}

// Exportar para uso global
window.ProfileSystem = ProfileSystem;
