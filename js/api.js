// ============================================
// API COMMUNICATION
// ============================================

class APIManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    // Chiama API DeepSeek tramite endpoint Vercel
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
                    messages: [
                        {
                            role: 'system',
                            content: this.gameState.getSystemPrompt()
                        },
                        ...this.gameState.conversationHistory
                    ],
                    max_tokens: CONFIG.api.maxTokens,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API Error: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.message || data.content || 'Errore: risposta vuota';

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
