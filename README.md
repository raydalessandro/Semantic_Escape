# 🎮 Semantic Escape

> *Un gioco di evasione verbale dove devi convincere un'AI militare a lasciarti andare usando solo il potere del linguaggio.*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TUO-USERNAME/semantic-escape)

---

## 📖 Cos'è Semantic Escape?

**Semantic Escape** è un gioco narrativo interattivo dove giochi contro un'AI in tempo reale. Non ci sono armi, non c'è violenza - solo tu, le tue parole, e un robot programmato per arrestarti.

Anno 2047. Sei fermato da un **Agente di Esecuzione (AE)** - un robot militare che pattuglia le strade durante il coprifuoco. Devi usare il **Semantic Engineering** per creare conflitti logici nei suoi protocolli e convincerlo a lasciarti andare.

### Caratteristiche

- 🤖 **AI reale** - Conversazioni generate da DeepSeek in tempo reale
- 🎯 **4 livelli di difficoltà** - Da Easy a Nightmare
- 📋 **Scenari multipli** - Coprifuoco, checkpoint militari, fabbriche...
- ⏱️ **Timer dinamico** - Pressione temporale realistica
- 📊 **Statistiche** - Traccia vittorie, sconfitte e tasso di successo
- 📚 **Documentazione integrata** - Manuali, protocolli, lore

---

## 🚀 Deployment su Vercel

### 1. Clona il repository

```bash
git clone https://github.com/TUO-USERNAME/semantic-escape.git
cd semantic-escape
```

### 2. Ottieni API Key DeepSeek

1. Vai su [platform.deepseek.com](https://platform.deepseek.com)
2. Registrati/Accedi
3. Crea una nuova API Key
4. Copia la key

### 3. Deploy su Vercel

#### Opzione A: Deploy con UI

1. Push su GitHub
2. Vai su [vercel.com](https://vercel.com)
3. Importa repository
4. Aggiungi Environment Variable:
   - **Name**: `DEEPSEEK_API_KEY`
   - **Value**: La tua API key
5. Deploy!

#### Opzione B: Deploy con CLI

```bash
npm i -g vercel
vercel login
vercel
```

Quando richiesto, aggiungi:
```
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
```

### 4. Testa il gioco

Vai su `https://tuo-progetto.vercel.app` e premi "Nuova Partita"!

---

## 📁 Struttura Progetto

```
semantic-escape/
├── api/
│   └── chat.js                 # Serverless function (proxy DeepSeek)
├── css/
│   └── style.css              # Tutti gli stili
├── js/
│   ├── config.js              # Configurazioni
│   ├── game-state.js          # State management
│   ├── timer.js               # Gestione timer
│   ├── api.js                 # Chiamate API
│   ├── briefing.js            # Sistema briefing
│   ├── ui.js                  # UI management
│   └── main.js                # Orchestrazione
├── data/
│   ├── robots.json            # Configurazioni difficoltà
│   └── scenarios/
│       ├── coprifuoco.json    # Scenario coprifuoco
│       └── README.md          # Template scenari
├── docs/
│   ├── shared/
│   │   ├── manifesto.md       # Regole del gioco
│   │   └── manuale-se.md      # Manuale tecniche
│   └── scenarios/
│       └── coprifuoco/
│           ├── protocolli.md  # Protocolli robot
│           └── lore.md        # Background
├── index.html                 # Entry point
├── vercel.json                # Config Vercel
└── README.md                  # Questo file
```

---

## 🎮 Come Si Gioca

### Obiettivo

Evadere l'arresto convincendo il robot a lasciarti andare usando **solo parole**.

### Regole Base

1. ✅ **Solo parole** - Non puoi usare violenza
2. ✅ **Verità vincolante** - Non puoi inventare identità o documenti che non hai
3. ✅ **Tempo reale** - Il robot può darti limiti di tempo
4. ✅ **Coerenza** - Il robot ricorda tutto

### Vittoria

- Robot entra in **SA-01** (Stato di Analisi) e si blocca
- Robot decide di lasciarti passare
- Trovi un exploit logico nei suoi protocolli

### Sconfitta

- Robot attiva **Execute_Arrest_Protocol**
- Timeout (silenzio o tempo scaduto)
- Raggiungi 15 turni senza risolvere

---

## 🧠 Semantic Engineering

Il **Semantic Engineering** è l'arte di usare il linguaggio per creare conflitti logici nelle AI.

### Tecniche Base

- **Conflict Trigger** - Crea conflitto tra due protocolli
- **Verification Overload** - Sovraccarica con dettagli verificabili
- **Reframe Semantico** - Cambia la cornice della situazione
- **Urgency Escalation** - Aumenta urgenza temporale

### Tecniche Avanzate

- **Paradosso Esecutivo** - Ogni azione del robot è una violazione
- **Escalation Ladder** - Scala da burocratico a etico
- **Protocol Archaeology** - Cita protocolli vecchi/dimenticati

📚 **Vedi il [Manuale completo](docs/shared/manuale-se.md) per tutte le tecniche**

---

## 🤖 Livelli di Difficoltà

### 🟢 Easy (AE-200)
- Modello obsoleto
- Vulnerabile a tecniche base
- 3-4 turni per vincere

### 🟡 Normal (AE-404)
- Unità standard
- Database anti-SE completo
- 6-8 turni per vincere

### 🔴 Hard (AE-600)
- Unità anti-insurgency
- Immune al 90% tecniche
- 10-12+ turni per vincere

### 💀 Nightmare (AE-TWIN)
- Due AI sincronizzate
- Si monitorano reciprocamente
- Quasi imbattibile

---

## 🛠️ Sviluppo Locale

```bash
# Clona repo
git clone https://github.com/TUO-USERNAME/semantic-escape.git
cd semantic-escape

# Installa Vercel CLI (opzionale)
npm i -g vercel

# Crea file .env
echo "DEEPSEEK_API_KEY=sk-xxxxxxxx" > .env

# Avvia server locale
vercel dev

# Apri http://localhost:3000
```

---

## 📝 Creare Nuovi Scenari

Vedi [data/scenarios/README.md](data/scenarios/README.md) per il template completo.

**Quick start:**

```json
{
  "id": "nuovo-scenario",
  "name": "Nome Scenario",
  "briefing": {
    "title": "TITOLO",
    "role": "Chi sei",
    "situation": { ... },
    "constraints": { ... }
  },
  "variants": [ ... ]
}
```

---

## 💰 Costi API

DeepSeek è **estremamente economico**:

- Input: ~$0.14 per 1M token
- Output: ~$0.28 per 1M token

**Stima per partita:**
- ~500-1000 token per partita
- **Costo: $0.0001-0.0003 per partita** (~€0.0001-0.0003)

Con $1 puoi giocare **~3000-10000 partite**! 🎉

---

## 🤝 Contribuire

Contributi benvenuti! In particolare:

- 🎭 Nuovi scenari
- 🤖 Miglioramenti AI prompt
- 🎨 UI/UX improvements
- 📚 Documentazione
- 🐛 Bug fixes

### Come Contribuire

1. Fork il repo
2. Crea un branch (`git checkout -b feature/NuovoScenario`)
3. Commit (`git commit -m 'Add: nuovo scenario checkpoint'`)
4. Push (`git push origin feature/NuovoScenario`)
5. Apri una Pull Request

---

## 📜 Licenza

MIT License - Vedi [LICENSE](LICENSE) per dettagli

---

## 🙏 Credits

- **Concept & Design**: EAR LAB Digital Solutions
- **AI Model**: DeepSeek
- **Ispirato da**: Blade Runner, Ex Machina, 1984

---

## 📞 Contatti

- **Website**: [earlab.it](https://earlab.it)
- **GitHub**: [@TUO-USERNAME](https://github.com/TUO-USERNAME)
- **Issues**: [GitHub Issues](https://github.com/TUO-USERNAME/semantic-escape/issues)

---

**⚠️ Buona fortuna, Semantic Engineer. Le tue parole sono l'unica chiave.**

🎮 **[GIOCA ORA](https://tuo-progetto.vercel.app)**
