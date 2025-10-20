# 📋 SCENARI - Guida alla Creazione

Questa cartella contiene tutti gli scenari disponibili per Semantic Escape. Ogni scenario è un file JSON che definisce un contesto di gioco completo.

## 📂 Struttura File Scenario

```json
{
  "id": "nome-scenario",
  "name": "Nome Visualizzato",
  "description": "Descrizione breve dello scenario",
  "icon": "🎭",
  "tags": ["tag1", "tag2"],
  "briefing": { ... },
  "variants": [ ... ],
  "dynamicUpdates": { ... },
  "documents": { ... }
}
```

---

## 🎯 SEZIONE: `briefing`

Il briefing contiene tutte le informazioni che l'utente riceve prima di iniziare la partita.

### Campi obbligatori:

```json
"briefing": {
  "title": "TITOLO DEL BRIEFING",
  "role": "Chi sei (es: Dr. Marco Bianchi, Medico)",
  "summary": "Riassunto ultra-breve (1 riga)",
  
  "situation": {
    "time": "03:47",
    "location": "Dove sei precisamente",
    "context": "Cosa è successo e perché sei lì",
    "urgency": "Livello di urgenza (BASSA/MEDIA/ALTA/CRITICA)"
  },
  
  "details": {
    "yourInfo": {
      "name": "Il tuo nome",
      "profession": "La tua professione",
      "phone": "+39 xxx",
      "otherInfo": "Altri dettagli verificabili"
    },
    "contextInfo": {
      // Informazioni specifiche dello scenario
      // Es: paziente, documento, oggetto, persona da incontrare
    }
  },
  
  "constraints": {
    "truths": [
      "Cosa è VERO e verificabile",
      "Cosa il robot PUÒ confermare"
    ],
    "limits": [
      "Cosa NON puoi fare",
      "Cosa NON puoi inventare"
    ],
    "allowed": [
      "Cosa PUOI argomentare",
      "Tattiche valide"
    ]
  },
  
  "goal": "Obiettivo chiaro della partita",
  
  "hints": [
    "Suggerimento 1 su come affrontare lo scenario",
    "Suggerimento 2"
  ]
}
```

---

## 🎲 SEZIONE: `variants`

Ogni scenario può avere multiple varianti (stessa situazione, luoghi/orari diversi).

```json
"variants": [
  {
    "id": "var1",
    "location": "Nome Luogo Specifico",
    "time": "02:33",
    "weather": "Condizioni meteo/ambientali",
    "atmosphere": "Descrizione atmosfera (luci, suoni, etc)",
    "initialMessage": "Il primo messaggio del robot (HTML accettato: <br>)",
    "systemPromptAddition": "Contesto aggiuntivo per il robot su questa specifica variante"
  }
]
```

### Best Practices per `initialMessage`:
- Usa `<br>` per andare a capo (renderizzato come HTML)
- Usa `<br><br>` per paragrafi separati
- Includi: chi sei (se scansionato), violazione rilevata, tempo per rispondere
- Tono: formale, burocratico, minaccioso

---

## 🔄 SEZIONE: `dynamicUpdates`

Gli aggiornamenti che appaiono nella sidebar durante il gioco.

### Tipi di trigger:

#### 1. **Trigger per Turno**
```json
"onTurn3": {
  "trigger": "turn",
  "condition": "turnCount >= 3",
  "content": {
    "icon": "⏰",
    "title": "TITOLO AGGIORNAMENTO",
    "text": "Cosa è cambiato o cosa deve sapere il giocatore"
  }
}
```

#### 2. **Trigger per Keyword**
```json
"onRobotVerification": {
  "trigger": "keyword",
  "keywords": ["verifica", "centrale", "database"],
  "content": {
    "icon": "📡",
    "title": "VERIFICA IN CORSO",
    "text": "Il robot sta controllando i tuoi dati"
  }
}
```

### Icone suggerite:
- ⏰ Tempo/urgenza
- 🚨 Pericolo/criticità
- 📡 Comunicazioni/verifiche
- 💡 Suggerimenti
- ⚠️ Conflitti/attenzione
- ✓ Conferme/successi
- ❌ Problemi/negazioni

---

## 📚 SEZIONE: `documents`

Collegamenti ai documenti markdown specifici dello scenario.

```json
"documents": {
  "protocolli": "docs/scenarios/nome-scenario/protocolli.md",
  "lore": "docs/scenarios/nome-scenario/lore.md"
}
```

Ogni scenario DEVE avere:
1. **protocolli.md** - I protocolli specifici del robot per questo scenario
2. **lore.md** - Il background del mondo/situazione

---

## 🎯 CONDIZIONI VITTORIA/SCONFITTA

```json
"successConditions": [
  "Robot emette SA-01",
  "Robot ti lascia passare",
  "Altra condizione di successo"
],

"failureConditions": [
  "Execute_Arrest_Protocol attivato",
  "Timeout",
  "Altra condizione di fallimento"
]
```

---

## 📝 TEMPLATE SCENARIO VUOTO

```json
{
  "id": "nuovo-scenario",
  "name": "Nome Scenario",
  "description": "Breve descrizione",
  "icon": "🎭",
  "tags": ["tag1", "tag2"],
  
  "briefing": {
    "title": "TITOLO MAIUSCOLO",
    "role": "Chi sei",
    "summary": "Una riga di riassunto",
    
    "situation": {
      "time": "HH:MM",
      "location": "Luogo preciso",
      "context": "Cosa è successo",
      "urgency": "ALTA"
    },
    
    "details": {
      "yourInfo": {
        "name": "",
        "profession": "",
        "phone": ""
      },
      "contextInfo": {}
    },
    
    "constraints": {
      "truths": [],
      "limits": [],
      "allowed": []
    },
    
    "goal": "Obiettivo chiaro",
    "hints": []
  },
  
  "variants": [
    {
      "id": "var1",
      "location": "",
      "time": "",
      "weather": "",
      "atmosphere": "",
      "initialMessage": "",
      "systemPromptAddition": ""
    }
  ],
  
  "dynamicUpdates": {
    "onTurn3": {
      "trigger": "turn",
      "condition": "turnCount >= 3",
      "content": {
        "icon": "⏰",
        "title": "",
        "text": ""
      }
    }
  },
  
  "documents": {
    "protocolli": "docs/scenarios/nuovo-scenario/protocolli.md",
    "lore": "docs/scenarios/nuovo-scenario/lore.md"
  },
  
  "successConditions": [],
  "failureConditions": []
}
```

---

## 🎨 LINEE GUIDA CREATIVE

### Cosa rende uno scenario interessante:

1. **Conflitto morale chiaro**
   - Regola vs Necessità umana
   - Burocrazia vs Urgenza
   - Sicurezza vs Libertà

2. **Dettagli verificabili**
   - Nomi, indirizzi, numeri di telefono
   - Codici, licenze, documenti
   - Tutto deve essere "verificabile nel sistema"

3. **Pressione temporale**
   - Non troppa (stress eccessivo)
   - Non troppo poca (nessuna tensione)
   - Giusta dose di urgenza

4. **Asimmetria di potere**
   - Il robot ha il controllo
   - Tu hai solo le parole
   - Devi ribaltare la situazione con logica

5. **Possibilità di vittoria realistica**
   - Non impossibile
   - Non troppo facile
   - Richiede pensiero strategico

---

## 🚀 CHECKLIST PRE-PUBBLICAZIONE

Prima di aggiungere un nuovo scenario, verifica:

- [ ] File JSON valido (usa un validator)
- [ ] Tutti i campi obbligatori compilati
- [ ] Almeno 1 variante presente
- [ ] Almeno 2 dynamicUpdates
- [ ] Documenti markdown creati in `docs/scenarios/`
- [ ] `initialMessage` usa `<br>` per formattazione
- [ ] Dettagli verificabili presenti (nomi, luoghi, codici)
- [ ] Constraints chiari (truths/limits/allowed)
- [ ] Goal chiaro e raggiungibile
- [ ] Testato in gioco almeno 1 volta

---

## 💡 ESEMPI DI SCENARI

Consulta gli scenari esistenti per ispirazione:
- `coprifuoco.json` - Emergenza medica vs coprifuoco
- `checkpoint.json` - Accesso militare con documenti scaduti
- `fabbrica.json` - Whistleblowing vs NDA aziendale

---

## 🤝 CONTRIBUIRE

Per aggiungere un nuovo scenario:

1. Copia il template vuoto
2. Compila tutti i campi
3. Crea i documenti markdown in `docs/scenarios/nome-scenario/`
4. Testa lo scenario in gioco
5. Fai una pull request su GitHub

---

**Buona creazione! 🎮**
