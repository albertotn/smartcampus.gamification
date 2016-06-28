# Idee per statistiche gioco:
#### Informazioni periodo di gioco corrente: ####
Sviluppando in questo modo basta esporre un solo metodo per il server REST, nel quale viene specificato la data di inizio e fine, se non specificata vengono ritornati i dati di tutti il periodo di gioco.
* Numero totale nuovi utenti;
* Media utenti attivi giornalmente;
* Media partite giocate per giorno;
* Media partite giocate per utente;
* Nuovi utenti;
* Utente più attivo;
* Numero totale delle partite giocate nel periodo;
* Numero totale di utenti;
* Numero di utenti attivi;
* Numero di giorni di gioco;

##### Formato JSON per dati di gioco
Se periodo specificato (es. 23/03/2016 - 28/06/2016) allora vengono ritornati i dati per il periodo altrimenti se non specificato il server invia i dati globali (utile se l'amministratore vuole vedere il report di gioco totale)
```javascript
{
  // Range intervallo periodo: da - a
  period: {
    from: <datetime>,
    to: <datetime>,
    totalDays: <number> // Numero di giorni di gioco
  },
  players: <number>, // Numero totale di utenti
  activePlayers: <number>, // Numero di utenti attivi
  matchs: <number>, // Numero partite giocate nel periodo dai giocatori attivi
  averages: { // Medie
    newPlayers: <number>, // Nuovi utenti giornalmente
    activePlayers: <number>, // Numero giocatori attivi giornalmente
    dayMatchs: <number>, // Numero partite giocate giornalmente
    playerMatchs: <number>, // Numero partite giocate per ogni giocatore attivo
  },
  newPlayers: [ // Nuovi giocatori
    // Rappresentazione nuovo giocatore
    {
      id: <id database>,
      name: <string>, // Nome giocatore
      date: <datetime> // Data di registrazione
    }
  ],
  bestPlayer: { // Miglior giocatore del periodo
    id: 3820320, // ID del giocatore (se previsto nel database)
    name: 'Mario Rossi', // Nome del giocatore
    totalPoints: <number>, // Punteggio totale del giocatore
    totalBadges: <number>, // Se il gioco lo prevede mostrare il totale dei badge
  },
  graphsData: {
    // Registrazioni per giorno + utenti attivi per giorno + partite giocate per giorno
    dayStats: [
      {
        date: <number>, // Data del giorno
        newUsers: <number>, // Numero dei nuovi utenti
        activeUsers: <number>, // Numero di utenti attivi
        playedMatchs: <number> // Numero di partite giocate
      }
    ],
    // Divisione punti per tipo
    pointsType: [
      {
        name: <name of point>,
        points: <number> // Numero di punti totale di tutti gli utenti su totale di tutti i punti
      }
    ],
    // Numero di utenti che hanno guadagnato i vari badge
    badgesUsers: [
      {
        name: <name of badge>,
        users: <number of users>
      }
    ]
  }
}
```

#### Grafici (range di default: ultima settimana):
* Grafico a linea per registrazione nuovi utenti ogni giorno (con opzione di selezione del range di giorni)
* Grafico a barre per utenti attivi ogni giorno o mese (da vedere in base al range)
* Grafico a barre per numero utenti che hanno conseguito i badge (per capire se è fattibile o meno guadagnare un badge piuttosto di un altro)
* Grafico a linea per punti totali di tutti gli utenti conseguiti giornalmente;
* Grafico a torta per mostrare la percentuale di punti per tipo;


#### Altre informazioni da includere nella pagina (da verificare se possibile realizzarlo o no)
* Ultimi 10 utenti aggiunti (con nome, foto profilo se c'è l'opzione, data di iscrizione)
* Tab con classifica giocatori (varie sfide disponibili), con possibilità di cliccare su ogni giocatore per visualizzare varie informazioni come nome, punti conseguiti, badge, attività giornaliera, media dei punti conseguiti ogni giorno ecc...

```javascript
/* DA VERIFICARE SE POSSIBILE O NO: chiamata al server con ID utente che restituisce tutte le informazioni utili a creare la pagina di dettaglio utente */
{
  id: <string>, // id del giocatore
  name: <string>, // Nome del giocatore
  nickname: <string>, // Se previsto: nick name del giocatore o nome utente (da verificare se previsto in fase di registrazione)
  totalPoints: <number>, // Punti totali
  totalBadges: <number>, // Distintivi totali
  points: {
    <type>: <number> // Tipo e numero per ogni punto
  },
  badges: {
    <type>: <number> // Tipo e numero per ogni distintivo
  },
  graphData: {
    // da definire: dati per cotruire grafici
  }
}
```
