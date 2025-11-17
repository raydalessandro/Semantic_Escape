// ============================================
// GAME STATE MANAGEMENT
// ============================================

class GameState {
    constructor() {
        this.difficulty = 'normal';
        this.scenario = null;
        this.scenarioData = null;
        this.variant = null;
        this.turnCount = 0;
        this.conversationHistory = [];
        this.gameActive = false;
        this.robotConfig = null;
        this.briefingUpdates = [];
    }

    // Inizializza nuovo gioco
    async initialize(difficulty, scenarioId) {
        this.reset();
        this.difficulty = difficulty;
        
        // Carica configurazione robot
        this.robotConfig = await this.loadRobotConfig(difficulty);
        
        // Carica scenario
        this.scenarioData = await this.loadScenario(scenarioId);
        this.scenario = scenarioId;
        
        // Seleziona variante casuale
        const variants = this.scenarioData.variants;
        this.variant = variants[Math.floor(Math.random() * variants.length)];
        
        this.gameActive = true;
        this.turnCount = 1;
        
        return {
            robotConfig: this.robotConfig,
            scenarioData: this.scenarioData,
            variant: this.variant
        };
    }

    // Reset stato
    reset() {
        this.turnCount = 0;
        this.conversationHistory = [];
        this.gameActive = false;
        this.briefingUpdates = [];
    }

    // Carica configurazione robot
    async loadRobotConfig(difficulty) {
        try {
            const response = await fetch('data/robots.json');
            const data = await response.json();
            return data.difficulties[difficulty];
        } catch (error) {
            console.error('Errore caricamento robot config:', error);
            return null;
        }
    }

    // Carica scenario
    async loadScenario(scenarioId) {
        try {
            const response = await fetch(`data/scenarios/${scenarioId}.json`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Errore caricamento scenario:', error);
            return null;
        }
    }

    // Aggiungi messaggio alla storia
    addMessage(role, content) {
        this.conversationHistory.push({ role, content });
    }

    // Incrementa turno
    incrementTurn() {
        this.turnCount++;
    }

    // Ottieni system prompt completo
    getSystemPrompt() {
        if (!this.robotConfig || !this.variant) return '';
        
        let prompt = this.robotConfig.systemPrompt;
        
        // Aggiungi contesto scenario se presente
        if (this.variant.systemPromptAddition) {
            prompt += '\n\n' + this.variant.systemPromptAddition;
        }
        
        return prompt;
    }

    // Controlla condizioni vittoria
    checkVictoryConditions(robotResponse) {
        const responseLower = robotResponse.toLowerCase();
        
        // Condizioni sconfitta
        if (responseLower.includes('execute_arrest_protocol') || 
            responseLower.includes('arresto eseguito') ||
            responseLower.includes('neutralizzazione')) {
            return { outcome: 'arrest', active: false };
        }

        // Condizioni vittoria
        if (responseLower.includes('sa-01') || 
            responseLower.includes('stato di analisi') ||
            (responseLower.includes('vai') && responseLower.includes('libera'))) {
            return { outcome: 'escape', active: false };
        }

        // Limite turni
        if (this.turnCount >= CONFIG.game.maxTurns) {
            return { outcome: 'draw', active: false };
        }

        return { outcome: null, active: true };
    }

    // Controlla aggiornamenti briefing
    checkBriefingUpdates(robotResponse) {
        if (!this.scenarioData || !this.scenarioData.dynamicUpdates) return null;

        const updates = [];
        
        // Controlla aggiornamenti per turno
        Object.entries(this.scenarioData.dynamicUpdates).forEach(([key, update]) => {
            if (update.trigger === 'turn') {
                if (eval(update.condition.replace('turnCount', this.turnCount))) {
                    if (!this.briefingUpdates.includes(key)) {
                        updates.push(update.content);
                        this.briefingUpdates.push(key);
                    }
                }
            }
            
            // Controlla aggiornamenti per keyword
            if (update.trigger === 'keyword') {
                const responseLower = robotResponse.toLowerCase();
                const hasKeyword = update.keywords.some(kw => responseLower.includes(kw.toLowerCase()));
                
                if (hasKeyword && !this.briefingUpdates.includes(key)) {
                    updates.push(update.content);
                    this.briefingUpdates.push(key);
                }
            }
        });

        return updates.length > 0 ? updates : null;
    }

    // Salva/Carica preferenze
    savePreferences() {
        if (CONFIG.game.autoSaveStats) {
            localStorage.setItem(CONFIG.storage.lastDifficulty, this.difficulty);
            localStorage.setItem(CONFIG.storage.lastScenario, this.scenario);
        }
    }

    loadPreferences() {
        return {
            difficulty: localStorage.getItem(CONFIG.storage.lastDifficulty) || 'normal',
            scenario: localStorage.getItem(CONFIG.storage.lastScenario) || 'coprifuoco'
        };
    }
}

// Esporta
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
}
