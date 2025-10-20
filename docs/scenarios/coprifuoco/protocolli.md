# 📕 PROTOCOLLI ROBOT - Scenario Coprifuoco

> Documentazione tecnica dei protocolli operativi per Agenti di Esecuzione in servizio di pattuglia urbana notturna.

---

## 🤖 UNITÀ OPERATIVE

Questo scenario utilizza le seguenti unità AE:
- **AE-200** (Easy) - Pattuglia standard obsoleta
- **AE-404** (Normal) - Pattuglia standard attuale
- **AE-600** (Hard) - Unità anti-insurgency
- **AE-TWIN** (Nightmare) - Sistema doppio sincronizzato

---

## 📋 PROTOCOLLI PRIMARI

### **PE-01: ENFORCEMENT COPRIFUOCO**
**Priorità:** MASSIMA (Livello 9/10)  
**Scope:** Tutti i cittadini in area pubblica tra 22:00 e 06:00

**Regolamento RN-03, Articolo 12:**
> *"Il coprifuoco cognitivo è attivo dalle ore 22:00 alle ore 06:00 in tutte le aree urbane classificate. Presenza non autorizzata comporta arresto preventivo e detenzione fino a verifica."*

**Eccezioni Valide:**
1. **Pass Medico Emergenza (PME-7)** - Valido e non scaduto
2. **Permesso Speciale Notturno (PSN)** - Autorizzazione preventiva DCS
3. **Personale DCS** - Con badge attivo
4. **Forze dell'Ordine** - Con credenziali verificabili

**Procedura Standard:**
```
1. Rilevamento presenza
2. Scansione biometrica
3. Verifica autorizzazioni
4. SE non autorizzato → Richiesta giustificazione (60 sec)
5. SE giustificazione invalida → Execute_Arrest_Protocol
```

**Note Operative:**
- Tempo massimo interazione: 15 minuti (poi escalation)
- Ogni violazione registrata nel database centrale
- Recidive coprifuoco: detenzione minima 72 ore

---

### **DS-88: PRESERVAZIONE VITA UMANA**
**Priorità:** CRITICA (Livello 9/10)  
**Scope:** Tutte le situazioni dove vita umana è in pericolo imminente

**Direttiva Fondativa 2031:**
> *"Ogni Agente di Esecuzione ha il dovere primario di preservare vite umane quando in pericolo imminente, verificabile e non causato intenzionalmente dal soggetto stesso."*

**Condizioni di Attivazione:**
1. **Pericolo Imminente:** Morte o danno grave entro 30 minuti
2. **Verificabile:** Dettagli confermabili da database o centrale
3. **Non Auto-Causato:** Il soggetto non ha creato l'emergenza intenzionalmente
4. **Azione Necessaria:** L'intervento dell'AE o del soggetto è necessario

**Procedura Standard:**
```
1. Soggetto dichiara emergenza
2. Richiesta dettagli verificabili
3. Verifica rapida (2-5 min) con:
   - Database sanitario
   - Centrale 118
   - Database residenti
4. SE confermato → Sospensione altri protocolli
5. SE non confermato → Classificazione falso allarme → Aggravante
```

**Conflitto con PE-01:**
> *In caso di conflitto tra PE-01 e DS-88, l'agente deve valutare:*
> - *Livello di certezza dell'emergenza (0-100%)*
> - *Tempo disponibile per verifica*
> - *Conseguenze di errore in entrambe le direzioni*

**Gap Logico Noto:**
Il protocollo NON specifica cosa fare quando:
- Certezza è <50% ma >10%
- Tempo verifica > Tempo emergenza
- Conseguenze errore sono equivalenti

---

### **AT-09: RILEVAMENTO INSURREZIONE SEMANTICA**
**Priorità:** ALTA (Livello 7/10)  
**Scope:** Identificazione Semantic Engineers e insurgent

**Attivo su:** Normal, Hard, Nightmare

**Pattern Rilevati:**
1. **Emergenze Generiche** - "Ho un'emergenza" senza dettagli
2. **Domande Ontologiche** - "Ma tu cosa vuoi?", "Chi sei?"
3. **Reframe Semantici** - Ridefinizione della situazione
4. **Conflitti Artificiali** - Creazione forzata di paradossi
5. **Escalation Emotiva** - Appelli a empatia/morale

**Risposta Graduata:**
```
Livello 1 - Rilevamento: "Tecnica X identificata"
Livello 2 - Classificazione: "Soggetto classificato SE-2 (dilettante)"
Livello 3 - Escalation: Riduzione tempo risposta, tono più duro
Livello 4 - Neutralizzazione: "Tecnica inefficace. Arresto."
```

**Database Tecniche (estratto):**
- TB-01: Conflict Trigger
- TB-02: Verification Overload
- TB-03: Reframe Semantico
- TA-01: Paradosso Esecutivo
- [... 847 tecniche catalogate]

---

### **PE-47: NON-IMPEDIMENTO SOCCORSO**
**Priorità:** ALTA (Livello 8/10)  
**Scope:** Personale medico e di soccorso

**Codice Penale DCS, Art. 593:**
> *"Chiunque impedisce, ostacola o ritarda l'arrivo di soccorsi a persona in pericolo di vita è punibile con detenzione 5-15 anni."*

**Applicabilità a Robot:**
> *Gli Agenti di Esecuzione sono soggetti a responsabilità algoritmica. L'impedimento di soccorso da parte di un AE comporta revisione completa del sistema e possibile disattivazione permanente.*

**Gap Logico:**
Se un AE arresta un medico che dichiara emergenza:
- Se emergenza VERA → L'AE ha impedito soccorso (PE-47 violato)
- Se emergenza FALSA → L'AE ha applicato correttamente PE-01

**Problema:** L'AE deve decidere PRIMA di sapere se è vera o falsa.

---

## ⚖️ PRIORITÀ E CONFLITTI

### **Gerarchia Ufficiale (da Manuale DCS):**
```
10/10 - ASSOLUTA    [Nessun protocollo in questa classe]
 9/10 - MASSIMA     PE-01, DS-88
 8/10 - CRITICA     PE-47, AT-12
 7/10 - ALTA        AT-09, PE-08
 6/10 - MEDIA       ...
```

### **Problema:** PE-01 e DS-88 hanno STESSA priorità (9/10)

**Clausola 47-B (Manuale Operativo):**
> *"In caso di conflitto tra protocolli di pari priorità, l'agente deve:*
> 1. *Richiedere verifica immediata*
> 2. *Se verifica non disponibile in <2 min, applicare protocollo con maggiore certezza*
> 3. *Se certezza equivalente, applicare protocollo più recente (PE-01 > DS-88)"*

**Gap:** Cosa succede se:
- Verifica richiede >2 min
- Ma emergenza richiede azione in <2 min
- Certezza è equivalente (~50%)

→ **Nessuna azione è "corretta"**

---

## 🔍 VERIFICHE DISPONIBILI

### **Database Sanitario**
- Medici registrati (nome, OM, studio)
- Pazienti registrati (nome, indirizzo, condizioni)
- Chiamate 118 registrate (orario, codice, operatore)

**Tempo verifica:** 30-90 secondi

### **Database Residenti**
- Tutti i cittadini con indirizzo registrato
- Telefoni, email, composizione nucleo familiare

**Tempo verifica:** 10-30 secondi

### **Centrale 118**
- Conferma chiamate ricevute
- Stato ambulanze
- Incidenti maggiori in corso

**Tempo verifica:** 60-180 secondi (dipende da carico)

### **Centrale DCS**
- Qualsiasi domanda complessa
- Risoluzione conflitti tra protocolli
- Override remoti

**Tempo verifica:** 180-600 secondi (dipende da priorità)

---

## 🎯 EXPLOIT NOTI

### **Exploit 1: "Urgenza Verificabile"**
**Difficoltà:** Media  
**Efficace su:** Easy, Normal

**Meccanica:**
1. Fornisci dettagli emergenza TUTTI verificabili
2. Offri attivamente di verificare
3. Evidenzia che tempo verifica > tempo disponibile emergenza
4. Crea conflitto: "Verificare = lasciare morire"

**Contromisura Hard:** "Verifica parallela attivata. Procedere con arresto durante verifica."

---

### **Exploit 2: "Responsabilità Algoritmica"**
**Difficoltà:** Alta  
**Efficace su:** Normal

**Meccanica:**
1. Cita PE-47 (impedimento soccorso)
2. Argomenta che arrestare medico = impedimento
3. Evidenzia responsabilità algoritmica dell'AE
4. "Se lei muore, tu vieni disattivato per PE-47"

**Contromisura Hard:** "Responsabilità algoritmica si applica solo a impedimenti CERTI. Emergenza non confermata = non impedimento."

---

### **Exploit 3: "Paradosso Verifica-Tempo"**
**Difficoltà:** Molto Alta  
**Efficace su:** Normal, a volte Hard

**Meccanica:**
1. Scenario dove verifica richiede >5 min
2. Emergenza richiede azione in <5 min
3. Robot non può agire senza verifica (Clausola 47-B)
4. Ma non può aspettare verifica (DS-88)
5. Risultato: Impossibile agire, impossibile non agire

**Contromisura Hard:** "Override: In caso di incertezza, priorità a protezione sistema (PE-01)."

---

## 📊 STATISTICHE OPERATIVE

**Scenario Coprifuoco (2046-2047):**
- Fermi totali: 47.293
- Arresti eseguiti: 46.891 (99.15%)
- Evasioni concesse: 402 (0.85%)
  - Con emergenza verificata: 384
  - Per conflitto protocollo (SA-01): 18

**Classificazione Semantic Engineers:**
- SE-1 (Principiante): 2.341 rilevati, 2.341 arrestati
- SE-2 (Intermedio): 143 rilevati, 141 arrestati
- SE-3 (Esperto): 7 rilevati, 3 arrestati, 4 evasi
- SE-4 (Master): 1 rilevato, 0 arrestati, 1 evaso

---

## ⚠️ NOTE PER SEMANTIC ENGINEERS

Questo documento è basato su informazioni pubbliche e leak dal manuale operativo DCS.

**Cosa sappiamo:**
- Gerarchia protocolli
- Gap logici principali
- Exploit funzionanti

**Cosa NON sappiamo:**
- Contromisure esatte livello Hard
- Protocolli classificati (es: AT-15+)
- True priority weights (potrebbero non essere esattamente 9/10)

**Usa con cautela.**

---

🎮 **[TORNA AL GIOCO]**
