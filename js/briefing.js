// ============================================
// BRIEFING SYSTEM
// ============================================

class BriefingManager {
    constructor() {
        this.currentBriefing = null;
        this.modalElement = null;
        this.sidebarElement = null;
    }

    // Inizializza elementi DOM
    initialize() {
        this.createModalElement();
        this.createSidebarElement();
    }

    // Crea modal briefing
    createModalElement() {
        const modal = document.createElement('div');
        modal.id = 'briefingModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>📋 BRIEFING MISSIONE</h2>
                    <button class="modal-close" id="closeBriefingModal">×</button>
                </div>
                <div class="modal-body" id="briefingModalContent">
                    <!-- Contenuto generato dinamicamente -->
                </div>
                <div style="padding: 20px; text-align: center; border-top: 1px solid #444;">
                    <button id="startGameFromBriefing" style="font-size: 1.1rem; padding: 12px 30px;">
                        ✓ Ho capito, inizia il gioco
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modalElement = modal;

        // Event listeners
        modal.querySelector('#closeBriefingModal').addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
    }

    // Crea sidebar briefing
    createSidebarElement() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const briefingCard = document.createElement('div');
        briefingCard.className = 'sidebar-card briefing';
        briefingCard.id = 'briefingSidebar';
        briefingCard.style.display = 'none';
        briefingCard.innerHTML = `
            <h3>📋 SITUAZIONE</h3>
            <div id="briefingSummary"></div>
            <div id="briefingUpdates" style="margin-top: 10px;"></div>
            <button id="expandBriefing" style="margin-top: 10px; width: 100%; font-size: 0.85rem;">
                📄 Vedi briefing completo
            </button>
        `;

        // Inserisci prima delle stats
        const statsCard = sidebar.querySelector('.stats');
        if (statsCard) {
            sidebar.insertBefore(briefingCard, statsCard);
        } else {
            sidebar.appendChild(briefingCard);
        }

        this.sidebarElement = briefingCard;

        // Event listener
        briefingCard.querySelector('#expandBriefing').addEventListener('click', () => this.showModal());
    }

    // Mostra briefing completo nel modal
    showModal(briefingData = this.currentBriefing) {
        if (!briefingData) return;

        const content = document.getElementById('briefingModalContent');
        if (!content) return;

        content.innerHTML = this.generateBriefingHTML(briefingData);
        this.modalElement.classList.add('active');
    }

    // Chiudi modal
    closeModal() {
        this.modalElement.classList.remove('active');
    }

    // Genera HTML briefing completo
    generateBriefingHTML(briefing) {
        let html = `
            <div style="padding: 20px; line-height: 1.8;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4488ff; padding-bottom: 20px;">
                    <h1 style="font-size: 1.8rem; color: #6699ff; margin-bottom: 10px;">
                        ${briefing.title}
                    </h1>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #6699ff; margin-bottom: 10px;">🎭 IL TUO RUOLO</h3>
                    <p style="font-size: 1.1rem;"><strong>${briefing.role}</strong></p>
                    <p style="color: #aaa; margin-top: 5px;">${briefing.summary}</p>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #6699ff; margin-bottom: 10px;">📍 SITUAZIONE</h3>
                    <p><strong>Luogo:</strong> ${briefing.situation.location}</p>
                    <p><strong>Ora:</strong> ${briefing.situation.time}</p>
                    <p style="margin-top: 10px;">${briefing.situation.context}</p>
                    <p style="margin-top: 10px; color: #ff6666;"><strong>Urgenza:</strong> ${briefing.situation.urgency}</p>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #6699ff; margin-bottom: 10px;">📋 DETTAGLI</h3>
                    ${this.generateDetailsHTML(briefing.details)}
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #6699ff; margin-bottom: 10px;">⚖️ VINCOLI</h3>
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #66ff66;">✓ COSA È VERO:</h4>
                        <ul style="margin-left: 20px;">
                            ${briefing.constraints.truths.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #ff6666;">✗ LIMITI:</h4>
                        <ul style="margin-left: 20px;">
                            ${briefing.constraints.limits.map(l => `<li>${l}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <h4 style="color: #6699ff;">→ PUOI:</h4>
                        <ul style="margin-left: 20px;">
                            ${briefing.constraints.allowed.map(a => `<li>${a}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #6699ff; margin-bottom: 10px;">🎯 OBIETTIVO</h3>
                    <p style="font-size: 1.1rem; padding: 15px; background: rgba(68, 136, 255, 0.2); border-left: 3px solid #4488ff; border-radius: 4px;">
                        ${briefing.goal}
                    </p>
                </div>

                ${briefing.hints && briefing.hints.length > 0 ? `
                <div>
                    <h3 style="color: #6699ff; margin-bottom: 10px;">💡 SUGGERIMENTI</h3>
                    <ul style="margin-left: 20px;">
                        ${briefing.hints.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `;

        return html;
    }

    // Genera HTML dettagli
    generateDetailsHTML(details) {
        let html = '';
        
        Object.entries(details).forEach(([key, value]) => {
            html += `<div style="margin-bottom: 15px;">`;
            html += `<h4 style="color: #aaa; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1').trim()}:</h4>`;
            html += `<ul style="margin-left: 20px; font-size: 0.95rem;">`;
            
            Object.entries(value).forEach(([k, v]) => {
                const label = k.replace(/([A-Z])/g, ' $1').trim();
                if (Array.isArray(v)) {
                    html += `<li><strong>${label}:</strong><ul style="margin-left: 15px;">`;
                    v.forEach(item => {
                        html += `<li>${item}</li>`;
                    });
                    html += `</ul></li>`;
                } else {
                    html += `<li><strong>${label}:</strong> ${v}</li>`;
                }
            });
            
            html += `</ul></div>`;
        });

        return html;
    }

    // Aggiorna sidebar con riassunto
    updateSidebar(briefing) {
        this.currentBriefing = briefing;
        const sidebar = document.getElementById('briefingSidebar');
        const summary = document.getElementById('briefingSummary');
        
        if (!sidebar || !summary) return;

        sidebar.style.display = 'block';
        
        // Estrai info chiave per riassunto
        const yourInfo = briefing.details.yourInfo || {};
        const contextInfo = Object.values(briefing.details)[1] || {}; // Secondo oggetto details

        summary.innerHTML = `
            <div style="font-size: 0.85rem; line-height: 1.6;">
                <p><strong>${yourInfo.name || briefing.role}</strong></p>
                ${yourInfo.phone ? `<p>Tel: ${yourInfo.phone}</p>` : ''}
                ${contextInfo.name ? `<p>Target: ${contextInfo.name}</p>` : ''}
                ${contextInfo.address ? `<p style="font-size: 0.8rem; color: #888;">${contextInfo.address}</p>` : ''}
            </div>
        `;
    }

    // Aggiungi aggiornamento dinamico
    addUpdate(updateContent) {
        const updatesDiv = document.getElementById('briefingUpdates');
        if (!updatesDiv) return;

        const updateEl = document.createElement('div');
        updateEl.style.cssText = 'padding: 10px; margin-top: 8px; background: rgba(255, 204, 68, 0.2); border-left: 3px solid #ffcc44; border-radius: 4px; font-size: 0.85rem;';
        updateEl.innerHTML = `
            <div style="font-weight: bold; color: #ffcc44; margin-bottom: 5px;">
                ${updateContent.icon} ${updateContent.title}
            </div>
            <div style="color: #ddd; line-height: 1.4;">
                ${updateContent.text}
            </div>
        `;

        updatesDiv.appendChild(updateEl);

        // Auto-scroll sidebar se necessario
        updatesDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Esporta
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BriefingManager;
}
