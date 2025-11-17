// ============================================
// CONFIGURAZIONE GLOBALE
// ============================================

const CONFIG = {
    // API Configuration
    api: {
        url: '/api/chat', // Endpoint Vercel serverless
        model: 'deepseek-chat',
        maxTokens: 2048
    },

    // Timer Configuration
    timer: {
        maxInactivity: 300, // 5 minuti in secondi
        minDuration: 60,     // Minimo 1 minuto anche se robot dice meno
        updateInterval: 1000 // Aggiornamento ogni secondo
    },

    // Game Configuration
    game: {
        maxTurns: 15,
        autoSaveStats: true
    },

    // File Paths
    paths: {
        robots: 'data/robots.json',
        scenarios: 'data/scenarios/',
        docs: 'docs/'
    },

    // UI Configuration
    ui: {
        maxInputLength: 500,
        scrollBehavior: 'smooth',
        typingDelay: 100
    },

    // Local Storage Keys
    storage: {
        stats: 'semanticEscapeStats',
        lastDifficulty: 'semanticEscapeLastDifficulty',
        lastScenario: 'semanticEscapeLastScenario'
    }
};

// Esporta configurazione
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
