

// Sistema de usuários
const userSystem = new UserSystem();
window.userSystem = userSystem;

// Sistema de perfil
const profileSystem = new ProfileSystem();
window.profileSystem = profileSystem;

// Sistema de conquistas
const achievements = {
    firstItem: { name: 'Primeiro Item', description: 'Adicionou o primeiro item', unlocked: false },
    fiveItems: { name: 'Colecionador', description: 'Adicionou 5 itens', unlocked: false },
    tenPoints: { name: 'Ponto de Virada', description: 'Alcançou 10 pontos totais', unlocked: false },
    editMaster: { name: 'Mestre das Edições', description: 'Editou 3 itens', unlocked: false }
};

// Estado global da aplicação
let items = JSON.parse(localStorage.getItem('items')) || [];
let editIndex = null;
let editId = null;
let totalPoints = parseInt(localStorage.getItem('totalPoints')) || 0;
let editCount = parseInt(localStorage.getItem('editCount')) || 0;

// Elementos da DOM
const itemForm = document.getElementById('itemForm');
const itemName = document.getElementById('itemName');
const itemDescription = document.getElementById('itemDescription');
const itemPoints = document.getElementById('itemPoints');
const itemsList = document.getElementById('itemsList');
const totalPointsDisplay = document.getElementById('totalPoints');
const achievementsList = document.getElementById('achievementsList');
const searchInput = document.getElementById('searchInput');
const filterPoints = document.getElementById('filterPoints');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    updateTotalPoints();
    checkAchievements();
    renderAchievements();
    
    // Event Listeners
    itemForm.addEventListener('submit', saveItem);
    searchInput.addEventListener('input', filterItems);
    filterPoints.addEventListener('change', filterItems);
});

// Função para salvar item
function saveItem(e) {
    e.preventDefault();
    
    const item = {
    id: editId || Date.now().toString(),
    name: itemName.value.trim(),
    description: itemDescription.value.trim(),
    points: parseInt(itemPoints.value),
    stars: 0, // Estrelas inicializadas como 0
    completed: false, // Item não concluído inicialmente
    date: editId ? new Date().toISOString() : new Date().toISOString()
    };
    
    // Validação
    const errors = validateItem(item);
    if (errors.length > 0) {
        errors.forEach(error => showMessage(error, 'error'));
        return;
    }
    
    if (editIndex !== null) {
        // Atualizar item existente
        items[editIndex] = item;
        editCount++;
        localStorage.setItem('editCount', editCount);
        showMessage('Item atualizado com sucesso!');
    } else {
        // Adicionar novo item
        items.push(item);
        showMessage('Item adicionado com sucesso!');
    }
    
    saveToLocalStorage();
    resetForm();
    loadItems();
    updateTotalPoints();
    checkAchievements();
}

// Função para carregar itens
function loadItems() {
    itemsList.innerHTML = '';
    
    if (items.length === 0) {
        itemsList.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum item cadastrado</td></tr>';
        return;
    }
    
    items.forEach((item, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = \
            <td>\</td>
            <td>\</td>
            <td>\</td>
            <td>\</td>
            <td>
                <button onclick="editItem(\)" class="btn btn-sm btn-primary" aria-label="Editar item \">Editar</button>
                <button onclick="deleteItem(\)" class="btn btn-sm btn-danger" aria-label="Excluir item \">Excluir</button>
            </td>
        \;
        
        itemsList.appendChild(tr);
    });
}

// Função para editar item
window.editItem = function(index) {
    const item = items[index];
    itemName.value = item.name;
    itemDescription.value = item.description;
    itemPoints.value = item.points;
    editIndex = index;
    editId = item.id;
    
    // Scroll para o formulário
    itemForm.scrollIntoView({ behavior: 'smooth' });
    itemName.focus();
};

// Função para excluir item
window.deleteItem = function(index) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        items.splice(index, 1);
        saveToLocalStorage();
        loadItems();
        updateTotalPoints();
        showMessage('Item excluído com sucesso!');
    }
};

// Função para filtrar itens
function filterItems() {
    const searchText = searchInput.value.toLowerCase();
    const pointsValue = parseInt(filterPoints.value);
    
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchText) || 
                             item.description.toLowerCase().includes(searchText);
        const matchesPoints = isNaN(pointsValue) || item.points >= pointsValue;
        
        return matchesSearch && matchesPoints;
    });
    
    renderFilteredItems(filteredItems);
}

// Função para renderizar itens filtrados
function renderFilteredItems(filteredItems) {
    itemsList.innerHTML = '';
    
    if (filteredItems.length === 0) {
        itemsList.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum item encontrado</td></tr>';
        return;
    }
    
    filteredItems.forEach((item, index) => {
        const originalIndex = items.findIndex(i => i.id === item.id);
        const tr = document.createElement('tr');
        
        tr.innerHTML = \
            <td>\</td>
            <td>\</td>
            <td>\</td>
            <td>\</td>
            <td>
                <button onclick="editItem(\)" class="btn btn-sm btn-primary">Editar</button>
                <button onclick="deleteItem(\)" class="btn btn-sm btn-danger">Excluir</button>
            </td>
        \;
        
        itemsList.appendChild(tr);
    });
}

// Função para atualizar pontos totais
function updateTotalPoints() {
    totalPoints = items.reduce((sum, item) => sum + item.points, 0);
    totalPointsDisplay.textContent = totalPoints;
    localStorage.setItem('totalPoints', totalPoints);
}

// Função para verificar conquistas
function checkAchievements() {
    const savedAchievements = JSON.parse(localStorage.getItem('achievements')) || {};
    
    // Primeiro item
    if (items.length >= 1 && !achievements.firstItem.unlocked) {
        achievements.firstItem.unlocked = true;
        showMessage('Conquista desbloqueada: Primeiro Item!', 'success');
    }
    
    // Cinco itens
    if (items.length >= 5 && !achievements.fiveItems.unlocked) {
        achievements.fiveItems.unlocked = true;
        showMessage('Conquista desbloqueada: Colecionador!', 'success');
    }
    
    // Dez pontos
    if (totalPoints >= 10 && !achievements.tenPoints.unlocked) {
        achievements.tenPoints.unlocked = true;
        showMessage('Conquista desbloqueada: Ponto de Virada!', 'success');
    }
    
    // Mestre das edições
    if (editCount >= 3 && !achievements.editMaster.unlocked) {
        achievements.editMaster.unlocked = true;
        showMessage('Conquista desbloqueada: Mestre das Edições!', 'success');
    }
    
    // Salvar conquistas
    Object.keys(achievements).forEach(key => {
        if (achievements[key].unlocked) {
            savedAchievements[key] = achievements[key];
        }
    });
    
    localStorage.setItem('achievements', JSON.stringify(savedAchievements));
    renderAchievements();
}

// Função para renderizar conquistas
function renderAchievements() {
    const savedAchievements = JSON.parse(localStorage.getItem('achievements')) || {};
    achievementsList.innerHTML = '';
    
    if (Object.keys(savedAchievements).length === 0) {
        achievementsList.innerHTML = '<li class="list-group-item">Nenhuma conquista desbloqueada</li>';
        return;
    }
    
    Object.values(savedAchievements).forEach(achievement => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = \
            <strong>\</strong>
            <span class="badge bg-success float-end">Desbloqueada</span>
            <br>
            <small>\</small>
        \;
        achievementsList.appendChild(li);
    });
}

// Função para salvar no localStorage
function saveToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(items));
}

// Função para resetar o formulário
function resetForm() {
    itemForm.reset();
    editIndex = null;
    editId = null;
}

// Exportar funções para uso global (necessário para os eventos onclick no HTML)
window.editItem = editItem;
window.deleteItem = deleteItem;



// ===== SISTEMA DE ESTRELAS SIMPLIFICADO =====
function initStarSystem() {
    // Adicionar coluna de avaliação na tabela
    const headerRow = document.querySelector('#itemsList tr');
    if (headerRow && !headerRow.querySelector('th:nth-child(6)')) {
        const starsHeader = document.createElement('th');
        starsHeader.textContent = 'Avaliação';
        headerRow.appendChild(starsHeader);
    }
    
    // Adicionar estrelas para cada item
    updateStars();
}

function updateStars() {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const rows = document.querySelectorAll('#itemsList tr');
    
    rows.forEach((row, index) => {
        if (index === 0) return; // Pular header
        
        const itemId = row.dataset.id || index;
        const item = items.find(i => i.id == itemId) || items[index - 1];
        
        if (item && !row.querySelector('.stars-cell')) {
            const starsCell = document.createElement('td');
            starsCell.className = 'stars-cell';
            
            starsCell.innerHTML = \`
                <div class="stars">
                    <span class="star" data-value="1" data-item="\${item.id}">\${item.stars >= 1 ? '⭐' : '☆'}</span>
                    <span class="star" data-value="2" data-item="\${item.id}">\${item.stars >= 2 ? '⭐' : '☆'}</span>
                    <span class="star" data-value="3" data-item="\${item.id}">\${item.stars >= 3 ? '⭐' : '☆'}</span>
                    <span class="star" data-value="4" data-item="\${item.id}">\${item.stars >= 4 ? '⭐' : '☆'}</span>
                    <span class="star" data-value="5" data-item="\${item.id}">\${item.stars >= 5 ? '⭐' : '☆'}</span>
                </div>
            \`;
            
            row.appendChild(starsCell);
        }
    });
    
    // Adicionar event listeners para as estrelas
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.value);
            const itemId = this.dataset.item;
            rateItem(itemId, rating);
        });
    });
}

function rateItem(itemId, rating) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const itemIndex = items.findIndex(item => item.id == itemId);
    
    if (itemIndex !== -1) {
        items[itemIndex].stars = rating;
        localStorage.setItem('items', JSON.stringify(items));
        
        // Atualizar visual
        updateStars();
        
        // Atualizar estatísticas
        if (window.profileSystem) {
            profileSystem.updateStats(items);
        }
        
        showMessage('Avaliação salva com sucesso!', 'success');
    }
}

// Inicializar sistema de estrelas quando a página carregar
setTimeout(initStarSystem, 1000);



// ===== INICIALIZAÇÃO DO SISTEMA =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de usuários
    setTimeout(() => {
        userSystem.updateRanking();
        userSystem.loadUserSelection();
    }, 1000);

    // Atualizar ranking a cada 30 segundos
    setInterval(() => {
        userSystem.updateRanking();
    }, 30000);
});

// Event listener para quando usuário faz login
window.addEventListener('userLoggedIn', function(e) {
    const user = e.detail;
    showMessage(\Bem-vindo, \!\, 'success');
    
    // Recarregar itens do usuário
    loadItems();
    
    // Atualizar ranking
    userSystem.updateRanking();
});
