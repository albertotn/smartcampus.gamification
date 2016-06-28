# Idee per statistiche gioco:
#### Informazioni periodo di gioco corrente: ####
Sviluppando in questo modo basta esporre un solo metodo per il server REST, nel quale viene specificato la data di inizio e fine, se non specificata vengono ritornati i dati di tutti il periodo di gioco.
* Periodo delle statistiche: da, a, giorni totali;
* Numero totale di giocatori;
* Numero di giocatori attivi;
* Numero totale delle partite;
* Medie fatta su giorni:
  * Nuovi utenti;
  * Utenti attivi;
  * Partite per giorno;
  * Partite giocate per giocatore;
* Nuovi giocatori: array dei nuovi giocatori con id, nome e data di iscrizione;
* Miglior giocatore: id, nome, punti totali, distintivi totali;
* Dati grafici:
  * Statistiche per giorni: data, nuovi utenti, utenti attivi, partite giocate;
  * Percentuale di popolamento tipo punto: nome punto, numero di punti su tutti gli utenti;
  * Diffusione badge: nome, numero utenti che hanno quel badge (serve per capire se un badge è utile o no a seconda del numero di utenti che sono riusciti a guadagnarlo);

##### Formato JSON per dati di gioco
Se periodo specificato (es. 23/03/2016 - 28/06/2016) allora vengono ritornati i dati per il periodo altrimenti se non specificato il server invia i dati globali (utile se l'amministratore vuole vedere il report di gioco totale)
```javascript
{
    "period": {
        "from": <datetime>,
        "to": <datetime>,
        "totalDays": <number>
    },
    "players": <number>,
    "activePlayers": <number>,
    "matchs": <number>,
    "averages": {
        "newPlayers": <number>,
        "activePlayers": <number>,
        "dayMatchs": <number>,
        "playerMatchs": <number>
    },
    "newPlayers": [
        {
            "id": 345522,
            "name": "Raffaele Calzà",
            "date": 1466460000
        }
    ],
    "bestPlayer": {
        "id": 3820320,
        "name": "Mario Rossi",
        "totalPoints": 54534334,
        "totalBadges": 8
    },
    "graphsData": {
        "dayStats": [
            {
                "date": 1465941600,
                "newUsers": 2,
                "activeUsers": 5,
                "playedMatchs": 7
            },
            {
                "date": 1466028000,
                "newUsers": 2,
                "activeUsers": 5,
                "playedMatchs": 7
            },
            {
                "date": 1466114400,
                "newUsers": 2,
                "activeUsers": 5,
                "playedMatchs": 7
            },
            {
                "date": 1466200800,
                "newUsers": 2,
                "activeUsers": 5,
                "playedMatchs": 7
            },
            {
                "date": 1466287200,
                "newUsers": 2,
                "activeUsers": 5,
                "playedMatchs": 7
            },
            {
                "date": 1466373600,
                "newUsers": 2,
                "activeUsers": 5,
                "playedMatchs": 7
            },
            {
                "date": 1466460000,
                "newUsers": 2,
                "activeUsers": 5,
                "playedMatchs": 7
            }
        ],
        "pointsType": [
            {
                "name": "punto 1",
                "points": 250
            },
            {
                "name": "punto 2",
                "points": 50
            },
            {
                "name": "punto 3",
                "points": 1
            },
            {
                "name": "punto 4",
                "points": 9
            },
            {
                "name": "punto 5",
                "points": 140
            }
        ],
        "badgesUsers": [
            {
                "name": "badge 1",
                "users": 2
            },
            {
                "name": "badge 2",
                "users": 34
            },
            {
                "name": "badge 3",
                "users": 100
            },
            {
                "name": "badge 4",
                "users": 50
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
