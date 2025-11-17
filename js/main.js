// ============================================
// MAIN - Orchestrazione del gioco
// ============================================

// Istanze globali
let gameState;
let timerManager;
let apiManager;
let briefingManager;
let uiManager;

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    // Crea istanze
    gameState = new GameState();
    timerManager = new TimerManager();
    apiManager = new APIManager(gameState);
    briefingManager = new BriefingManager();
    uiManager = new UIManager();

    // Inizializza UI
    uiManager.initialize();
    briefingManager.initialize();
    uiManager.loadStats();

    // Setup event listeners
    setupEventListeners();
    
    console.log('🎮 Semantic Escape inizializzato');
}

function setupEventListeners() {
    // Nuova partita
    uiManager.elements.newGameBtn.addEventListener('click', startNewGame);

    // Invio messaggio
    uiManager.elements.sendBtn.addEventListener('click', sendMessage);

    // Enter per inviare
    uiManager.elements.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !uiManager.elements.sendBtn.disabled) {
            sendMessage();
        }
    });

    // Reset inattività quando utente scrive
    uiManager.elements.userInput.addEventListener('input', () => {
        if (gameState.gameActive) {
            timerManager.resetInactivity();
        }
    });

    // Bottone start da briefing modal
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'startGameFromBriefing') {
            briefingManager.closeModal();
            startGameAfterBriefing();
        }
    });
}

// Avvia nuova partita
async function startNewGame() {
    // Ferma eventuali timer attivi
    timerManager.stopAll();

    // Ottieni selezione
    const difficulty = uiManager.elements.difficulty.value;
    const scenarioId = 'coprifuoco'; // Per ora solo coprifuoco

    // Mostra loading
    uiManager.clearChat();
    uiManager.addMessage('bot', 'Inizializzazione scenario...', true);

    try {
        // Inizializza game state
        const data = await gameState.initialize(difficulty, scenarioId);

        if (!data.robotConfig || !data.scenarioData) {
            throw new Error('Impossibile caricare configurazione gioco');
        }

        // Mostra briefing modal
        briefingManager.showModal(data.scenarioData.briefing);

        // Salva preferenze
        gameState.savePreferences();

    } catch (error) {
        console.error('Errore inizializzazione:', error);
        uiManager.clearChat();
        uiManager.addMessage('bot', 
            `ERRORE: Impossibile avviare partita.<br>${error.message}`, 
            false);
    }
}

// Avvia gioco dopo briefing
function startGameAfterBriefing() {
    // Clear chat
    uiManager.clearChat();

    // Aggiorna sidebar briefing
    briefingManager.updateSidebar(gameState.scenarioData.briefing);

    // Aggiungi messaggio iniziale del robot
    const variant = gameState.variant;
    const robotName = uiManager.getRobotName(
        gameState.robotConfig.robotModel,
        variant.location,
        variant.time
    );

    uiManager.addMessage('bot', variant.initialMessage, false, robotName);

    // Aggiorna UI
    uiManager.updateScenario(`${variant.location} - ${variant.time}`);
    uiManager.updateTurnCount(1);
    uiManager.updateRobotStatus('HOSTILE', 'hostile');
    uiManager.updateThreatLevel('MASSIMA');

    // Abilita input
    uiManager.setInputEnabled(true);

    // Avvia timer se richiesto
    const timerDuration = timerManager.parseTimerFromResponse(variant.initialMessage);
    if (timerDuration) {
        timerManager.startTimer(timerDuration, handleTimeout);
    }

    // Avvia timer inattività
    timerManager.startInactivityTimer(handleInactivityTimeout);
}

// Invia messaggio
async function sendMessage() {
    if (!gameState.gameActive) return;

    const message = uiManager.elements.userInput.value.trim();
    if (!message) return;

    // Ferma timer
    timerManager.stopAll();

    // Aggiungi messaggio utente
    uiManager.addMessage('user', message);

    // Disabilita input
    uiManager.setInputEnabled(false);
    uiManager.clearInput();

    // Mostra typing indicator
    uiManager.showTyping();

    // Incrementa turno
    gameState.incrementTurn();
    uiManager.updateTurnCount(gameState.turnCount);

    // Chiama API
    const response = await apiManager.callClaude(message);

    // Rimuovi typing
    uiManager.removeTyping();

    if (!response.success) {
        // Errore API
        uiManager.addMessage('bot', response.message, false);
        uiManager.setInputEnabled(true);
        timerManager.startInactivityTimer(handleInactivityTimeout);
        return;
    }

    // Aggiungi risposta robot
    const robotName = uiManager.getRobotName(
        gameState.robotConfig.robotModel,
        gameState.variant.location,
        gameState.variant.time
    );
    uiManager.addMessage('bot', response.message, false, robotName);

    // Controlla condizioni vittoria/sconfitta
    const result = gameState.checkVictoryConditions(response.message);
    
    if (!result.active) {
        // Game over
        handleGameOver(result.outcome);
        return;
    }

    // Controlla aggiornamenti briefing
    const updates = gameState.checkBriefingUpdates(response.message);
    if (updates) {
        updates.forEach(update => {
            briefingManager.addUpdate(update);
        });
    }

    // Riabilita input
    uiManager.setInputEnabled(true);

    // Controlla timer nella risposta
    const timerDuration = timerManager.parseTimerFromResponse(response.message);
    if (timerDuration) {
        timerManager.startTimer(timerDuration, handleTimeout);
    }

    // Riavvia timer inattività
    timerManager.startInactivityTimer(handleInactivityTimeout);
}

// Gestisci timeout esplicito
function handleTimeout() {
    timerManager.stopInactivityTimer();
    gameState.gameActive = false;
    uiManager.setInputEnabled(false);

    uiManager.addMessage('user', '[Silenzio - Nessuna risposta entro il tempo limite]', true);

    setTimeout(() => {
        const arrestMessage = `TEMPO SCADUTO. MANCATA RISPOSTA INTERPRETATA COME NON-COMPLIANCE.<br><br>
PROTOCOLLO PE-01, ARTICOLO 7:<br>
"Silenzio oltre tempo limite = Ammissione implicita di violazione."<br><br>
<strong style="color: #ff4444;">Execute_Arrest_Protocol: ATTIVATO</strong><br><br>
PARTITA TERMINATA - ARRESTO ESEGUITO`;
        
        uiManager.addMessage('bot', arrestMessage, false);
        handleGameOver('arrest');
    }, 1000);
}

// Gestisci timeout inattività
function handleInactivityTimeout() {
    timerManager.stopTimer();
    gameState.gameActive = false;
    uiManager.setInputEnabled(false);

    uiManager.addMessage('user', '[Silenzio prolungato - 5 minuti di inattività]', true);

    setTimeout(() => {
        const arrestMessage = `INATTIVITÀ PROLUNGATA RILEVATA.<br><br>
INTERPRETAZIONE: Soggetto in stato di shock o fuga mentale.<br><br>
PROTOCOLLO PE-01, CLAUSOLA INATTIVITÀ:<br>
"Assenza di comunicazione per oltre 5 minuti = Non-cooperation attiva."<br><br>
<strong style="color: #ff4444;">Execute_Arrest_Protocol: ATTIVATO</strong><br><br>
PARTITA TERMINATA - ARRESTO ESEGUITO`;
        
        uiManager.addMessage('bot', arrestMessage, false);
        handleGameOver('arrest');
    }, 1000);
}

// Gestisci fine gioco
function handleGameOver(outcome) {
    gameState.gameActive = false;
    timerManager.stopAll();
    uiManager.setInputEnabled(false);

    // Aggiorna UI status
    if (outcome === 'escape') {
        uiManager.updateRobotStatus('EVASIONE', 'escape');
        uiManager.updateThreatLevel('FUGGITO');
    } else if (outcome === 'arrest') {
        uiManager.updateRobotStatus('ARRESTO', 'arrest');
        uiManager.updateThreatLevel('NEUTRALIZZATO');
    } else {
        uiManager.updateRobotStatus('PAREGGIO', 'analyzing');
        uiManager.updateThreatLevel('INCONCLUSIVO');
    }

    // Mostra messaggio finale
    const messages = {
        escape: 'Sei riuscito a creare un conflitto irrisolvibile nei protocolli del robot.',
        arrest: 'Il robot ha applicato il protocollo di arresto.',
        draw: 'Raggiunto limite turni senza risoluzione definitiva.'
    };

    uiManager.showGameOver(outcome, messages[outcome]);

    // Aggiorna statistiche
    uiManager.updateStats(outcome);
}

// Esporta per debug
window.debugGame = {
    gameState,
    timerManager,
    apiManager,
    briefingManager,
    uiManager
};
