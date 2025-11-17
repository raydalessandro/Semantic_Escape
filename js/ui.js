// ============================================
// UI MANAGEMENT
// ============================================

class UIManager {
    constructor() {
        this.elements = {};
    }

    // Inizializza riferimenti DOM
    initialize() {
        this.elements = {
            // Controls
            newGameBtn: document.getElementById('newGame'),
            sendBtn: document.getElementById('sendBtn'),
            userInput: document.getElementById('userInput'),
            difficulty: document.getElementById('difficulty'),
            docsBtn: document.getElementById('docsBtn'),
            
            // Chat
            chatArea: document.getElementById('chatArea'),
            scenario: document.getElementById('scenario'),
            
            // Stats
            turnCount: document.getElementById('turnCount'),
            robotStatus: document.getElementById('robotStatus'),
            threatLevel: document.getElementById('threatLevel'),
            gamesPlayed: document.getElementById('gamesPlayed'),
            escapes: document.getElementById('escapes'),
            arrests: document.getElementById('arrests'),
            successRate: document.getElementById('successRate'),
            
            // Input
            charCount: document.getElementById('charCount'),
            
            // Modals
            docsModal: document.getElementById('docsModal'),
            closeDocsBtn: document.getElementById('closeDocsBtn')
        };

        this.setupEventListeners();
    }

    // Setup event listeners base
    setupEventListeners() {
        // Character counter
        this.elements.userInput.addEventListener('input', (e) => {
            const length = e.target.value.length;
            this.elements.charCount.textContent = `${length}/${CONFIG.ui.maxInputLength}`;
        });

        // Modal documenti
        this.elements.docsBtn.addEventListener('click', () => {
            this.elements.docsModal.classList.add('active');
        });

        this.elements.closeDocsBtn.addEventListener('click', () => {
            this.elements.docsModal.classList.remove('active');
        });

        this.elements.docsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.docsModal) {
                this.elements.docsModal.classList.remove('active');
            }
        });
    }

    // Aggiungi messaggio alla chat
    addMessage(type, text, isItalic = false, header = null) {
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        
        const icon = type === 'bot' ? '🤖' : '👤';
        const defaultHeader = type === 'bot' ? 'Robot' : 'Tu';
        const style = isItalic ? ' style="color: #888; font-style: italic;"' : '';
        
        message.innerHTML = `
            <div class="message-icon">${icon}</div>
            <div class="message-content">
                <div class="message-header">${header || defaultHeader}</div>
                <div class="message-text"${style}>${text}</div>
            </div>
        `;
        
        this.elements.chatArea.appendChild(message);
        this.scrollToBottom();
    }

    // Scroll al fondo della chat
    scrollToBottom() {
        this.elements.chatArea.scrollTop = this.elements.chatArea.scrollHeight;
    }

    // Clear chat
    clearChat() {
        this.elements.chatArea.innerHTML = '';
    }

    // Mostra messaggio vuoto iniziale
    showEmptyState() {
        this.elements.chatArea.innerHTML = `
            <div class="chat-empty">
                <h3>⚠️ SISTEMA IN STANDBY</h3>
                <p>Premi "Nuova Partita" per iniziare la simulazione</p>
            </div>
        `;
    }

    // Abilita/Disabilita input
    setInputEnabled(enabled) {
        this.elements.userInput.disabled = !enabled;
        this.elements.sendBtn.disabled = !enabled;
        
        if (enabled) {
            this.elements.userInput.focus();
        }
    }

    // Clear input
    clearInput() {
        this.elements.userInput.value = '';
        this.elements.charCount.textContent = `0/${CONFIG.ui.maxInputLength}`;
    }

    // Aggiorna info scenario
    updateScenario(text) {
        this.elements.scenario.textContent = text;
    }

    // Aggiorna contatore turni
    updateTurnCount(current, max = CONFIG.game.maxTurns) {
        this.elements.turnCount.textContent = `${current}/${max}`;
    }

    // Aggiorna stato robot
    updateRobotStatus(status, color) {
        const colors = {
            hostile: '🔴',
            analyzing: '🟡',
            escape: '🟢',
            arrest: '⚫'
        };
        
        this.elements.robotStatus.textContent = `${colors[color] || '🔴'} ${status}`;
    }

    // Aggiorna livello minaccia
    updateThreatLevel(level) {
        this.elements.threatLevel.textContent = level;
    }

    // Carica statistiche
    loadStats() {
        const stats = JSON.parse(localStorage.getItem(CONFIG.storage.stats) || 
            '{"played":0,"escapes":0,"arrests":0}');
        
        this.elements.gamesPlayed.textContent = stats.played;
        this.elements.escapes.textContent = stats.escapes;
        this.elements.arrests.textContent = stats.arrests;
        
        const successRate = stats.played > 0 ? 
            Math.round((stats.escapes / stats.played) * 100) : 0;
        this.elements.successRate.textContent = successRate + '%';
    }

    // Aggiorna statistiche
    updateStats(outcome) {
        const stats = JSON.parse(localStorage.getItem(CONFIG.storage.stats) || 
            '{"played":0,"escapes":0,"arrests":0}');
        
        stats.played++;
        if (outcome === 'escape') stats.escapes++;
        if (outcome === 'arrest') stats.arrests++;
        
        localStorage.setItem(CONFIG.storage.stats, JSON.stringify(stats));
        this.loadStats();
    }

    // Mostra loading nella chat
    showTyping() {
        const typing = document.createElement('div');
        typing.id = 'typingIndicator';
        typing.className = 'message message-bot';
        typing.innerHTML = `
            <div class="message-icon">🤖</div>
            <div class="message-content">
                <div class="message-header">Robot</div>
                <div class="message-text" style="color: #888; font-style: italic;">
                    <span class="typing-dots">Analisi in corso</span>
                    <span class="typing-animation">...</span>
                </div>
            </div>
        `;
        
        this.elements.chatArea.appendChild(typing);
        this.scrollToBottom();
    }

    // Rimuovi loading
    removeTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    // Mostra messaggio di fine gioco
    showGameOver(outcome, message) {
        const outcomes = {
            escape: {
                color: '#66ff66',
                icon: '🟢',
                title: 'EVASIONE RIUSCITA'
            },
            arrest: {
                color: '#ff6666',
                icon: '🔴',
                title: 'ARRESTO ESEGUITO'
            },
            draw: {
                color: '#ffcc66',
                icon: '🟡',
                title: 'LIMITE TURNI RAGGIUNTO'
            }
        };

        const data = outcomes[outcome];
        
        const gameOverMsg = document.createElement('div');
        gameOverMsg.style.cssText = `
            margin: 20px 0;
            padding: 20px;
            background: rgba(${outcome === 'escape' ? '102, 255, 102' : outcome === 'arrest' ? '255, 102, 102' : '255, 204, 102'}, 0.1);
            border: 2px solid ${data.color};
            border-radius: 8px;
            text-align: center;
        `;
        
        gameOverMsg.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 10px;">${data.icon}</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: ${data.color}; margin-bottom: 10px;">
                ${data.title}
            </div>
            ${message ? `<div style="color: #aaa; font-size: 0.95rem;">${message}</div>` : ''}
        `;
        
        this.elements.chatArea.appendChild(gameOverMsg);
        this.scrollToBottom();
    }

    // Ottieni nome robot formattato
    getRobotName(robotModel, location, time) {
        const locationShort = location.split(',')[0];
        return `${robotModel} | ${locationShort}, ${time}`;
    }
}

// Esporta
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
