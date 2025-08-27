// ===== SISTEMA DE USUÁRIOS E RANKING =====
class UserSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        this.loadUserSelection();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Enter para login rápido
        document.getElementById('userName')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });
    }

    login() {
        const userNameInput = document.getElementById('userName');
        if (!userNameInput) return;

        const userName = userNameInput.value.trim();
        if (!userName) {
            alert('Digite um nome de usuário!');
            return;
        }

        // Encontrar ou criar usuário
        let user = this.users.find(u => u.name.toLowerCase() === userName.toLowerCase());
        
        if (!user) {
            user = {
                id: Date.now().toString(),
                name: userName,
                points: 0,
                completedItems: 0,
                totalItems: 0,
                joined: new Date().toISOString(),
                lastActivity: new Date().toISOString()
            };
            this.users.push(user);
            this.saveUsers();
            showMessage(`Novo usuário criado: ${userName}`, 'success');
        }

        this.currentUser = user;
        this.updateUI();
        this.saveUsers();

        // Disparar evento de login
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
    }

    logout() {
        this.currentUser = null;
        this.updateUI();
        showMessage('Logout realizado', 'info');
    }

    addPoints(points) {
        if (!this.currentUser) return;
        
        this.currentUser.points += points;
        this.currentUser.lastActivity = new Date().toISOString();
        this.saveUsers();
        this.updateUI();
        this.updateRanking();
    }

    completeItem() {
        if (!this.currentUser) return;
        
        this.currentUser.completedItems++;
        this.currentUser.lastActivity = new Date().toISOString();
        this.saveUsers();
        this.updateUI();
        this.updateRanking();
    }

    addItem() {
        if (!this.currentUser) return;
        
        this.currentUser.totalItems++;
        this.currentUser.lastActivity = new Date().toISOString();
        this.saveUsers();
        this.updateUI();
        this.updateRanking();
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    updateUI() {
        const loginSection = document.getElementById('user-login-section');
        const userInfoSection = document.getElementById('user-info-section');
        const userNameSpan = document.getElementById('current-user-name');
        const userPointsSpan = document.getElementById('current-user-points');

        if (this.currentUser) {
            loginSection?.classList.add('d-none');
            userInfoSection?.classList.remove('d-none');
            if (userNameSpan) userNameSpan.textContent = this.currentUser.name;
            if (userPointsSpan) userPointsSpan.textContent = this.currentUser.points;
        } else {
            loginSection?.classList.remove('d-none');
            userInfoSection?.classList.add('d-none');
        }
    }

    loadUserSelection() {
        const userSelect = document.getElementById('userSelect');
        if (!userSelect) return;

        userSelect.innerHTML = '<option value="">Selecionar usuário...</option>';
        this.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name} (${user.points} pts)`;
            userSelect.appendChild(option);
        });

        userSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                const user = this.users.find(u => u.id === e.target.value);
                if (user) {
                    document.getElementById('userName').value = user.name;
                }
            }
        });
    }

    updateRanking() {
        const rankingContainer = document.getElementById('user-ranking');
        if (!rankingContainer) return;

        // Ordenar usuários por pontos (decrescente)
        const sortedUsers = [...this.users].sort((a, b) => b.points - a.points);

        rankingContainer.innerHTML = \`
            <h4>🏆 Ranking de Usuários</h4>
            <div class="ranking-list">
                \${sortedUsers.map((user, index) => \`
                    <div class="ranking-item \${user.id === this.currentUser?.id ? 'current-user' : ''}">
                        <span class="rank-number">\${index + 1}º</span>
                        <span class="user-name">\${user.name}</span>
                        <span class="user-points">\${user.points} pts</span>
                        <span class="user-items">\${user.completedItems}/\${user.totalItems} itens</span>
                    </div>
                \`).join('')}
            </div>
        \`;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Exportar para uso global
window.UserSystem = UserSystem;
