// ============================================
// TIMER MANAGEMENT
// ============================================

class TimerManager {
    constructor() {
        this.timerInterval = null;
        this.inactivityInterval = null;
        this.timeRemaining = 0;
        this.inactivityTime = 0;
        this.onTimeoutCallback = null;
        this.onInactivityCallback = null;
    }

    // Parse timer dal messaggio del robot
    parseTimerFromResponse(text) {
        const patterns = [
            /(\d+)\s*second[oi]/i,
            /entro\s*(\d+)/i,
            /tempo.*?(\d+)/i,
            /limite.*?(\d+)/i
        ];

        for (let pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                let seconds = parseInt(match[1]);
                
                // Tempo minimo realistico
                if (seconds <= 15) return 60;
                if (seconds <= 30) return 90;
                if (seconds <= 60) return 120;
                return Math.max(seconds, CONFIG.timer.minDuration);
            }
        }
        
        return null;
    }

    // Avvia timer esplicito
    startTimer(duration, onTimeout) {
        this.timeRemaining = duration;
        this.onTimeoutCallback = onTimeout;
        
        this.updateTimerDisplay(true);
        
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay(true);

            if (this.timeRemaining <= 0) {
                this.stopTimer();
                if (this.onTimeoutCallback) this.onTimeoutCallback();
            }
        }, CONFIG.timer.updateInterval);
    }

    // Ferma timer esplicito
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.updateTimerDisplay(false);
    }

    // Avvia timer inattività
    startInactivityTimer(onInactivity) {
        this.inactivityTime = 0;
        this.onInactivityCallback = onInactivity;
        
        if (this.inactivityInterval) clearInterval(this.inactivityInterval);

        this.inactivityInterval = setInterval(() => {
            this.inactivityTime++;
            
            if (this.inactivityTime >= CONFIG.timer.maxInactivity) {
                this.stopInactivityTimer();
                if (this.onInactivityCallback) this.onInactivityCallback();
            }
        }, CONFIG.timer.updateInterval);
    }

    // Ferma timer inattività
    stopInactivityTimer() {
        if (this.inactivityInterval) {
            clearInterval(this.inactivityInterval);
            this.inactivityInterval = null;
        }
        this.inactivityTime = 0;
    }

    // Reset timer inattività (chiamato quando utente scrive)
    resetInactivity() {
        this.inactivityTime = 0;
    }

    // Aggiorna display timer
    updateTimerDisplay(visible) {
        const timerCard = document.getElementById('timerCard');
        const timerNumber = document.getElementById('timerNumber');
        const timerBar = document.getElementById('timerBar');

        if (!timerCard || !timerNumber || !timerBar) return;

        if (visible) {
            timerCard.style.display = 'block';
            timerNumber.textContent = this.timeRemaining;
            
            const percentage = (this.timeRemaining / 120) * 100;
            timerBar.style.width = Math.min(percentage, 100) + '%';

            if (this.timeRemaining <= 10) {
                timerNumber.classList.add('critical');
            } else {
                timerNumber.classList.remove('critical');
            }
        } else {
            timerCard.style.display = 'none';
        }
    }

    // Ferma tutti i timer
    stopAll() {
        this.stopTimer();
        this.stopInactivityTimer();
    }
}

// Esporta
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimerManager;
}
