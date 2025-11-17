// ============================================
// API COMMUNICATION
// ============================================

class APIManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    // Chiama API Claude
    async callClaude(userMessage) {
        try {
            // Aggiungi messaggio utente alla storia
            this.gameState.addMessage('user', userMessage);

            const response = await fetch(CONFIG.api.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: CONFIG.api.model,
                    max_tokens: CONFIG.api.maxTokens,
                    system: this.gameState.getSystemPrompt(),
                    messages: this.gameState.conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.content[0].text;

            // Aggiungi risposta assistant alla storia
            this.gameState.addMessage('assistant', assistantMessage);

            return {
                success: true,
                message: assistantMessage
            };

        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                message: this.getErrorMessage(error)
            };
        }
    }

    // Genera messaggio di errore user-friendly
    getErrorMessage(error) {
        return `ERRORE DI SISTEMA: Impossibile processare richiesta.<br><br>
[Errore tecnico: ${error.message}]<br><br>
Per favore riprova o ricarica la pagina.`;
    }
}

// Esporta
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIManager;
}
