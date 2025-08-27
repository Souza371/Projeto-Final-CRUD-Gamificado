// Validações para o sistema
export const validateItem = (item) => {
    const errors = [];
    
    if (!item.name || item.name.trim().length < 2) {
        errors.push("Nome deve ter pelo menos 2 caracteres");
    }
    
    if (!item.description || item.description.trim().length < 10) {
        errors.push("Descrição deve ter pelo menos 10 caracteres");
    }
    
    if (!item.points || isNaN(item.points) || item.points < 0) {
        errors.push("Pontos deve ser um número positivo");
    }
    
    return errors;
};

export const showMessage = (message, type = 'success') => {
    // Remove mensagens anteriores
    const existingMessages = document.querySelectorAll('.system-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = system-message alert alert- + type;
    messageDiv.textContent = message;
    messageDiv.style.cssText = 
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 15px;
        border-radius: 5px;
        color:  + (type === 'success' ? '#155724' : '#721c24') + ;
        background-color:  + (type === 'success' ? '#d4edda' : '#f8d7da') + ;
        border: 1px solid  + (type === 'success' ? '#c3e6cb' : '#f5c6cb') + ;
    ;
    
    document.body.appendChild(messageDiv);
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
};
