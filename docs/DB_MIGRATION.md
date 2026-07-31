# Migrazione del DB con zero-downtime per BLUE-GREEN

Migrazione addittiva del db con deployment blue-green attivo, per dimostrarne il funzionamento corretto si è previsto di prevedere un'aggiunta del campo email nell tabella dello staff con versione blue che non la implementa.

## 1. Architettura nuova

Create due versioni del backend, una con email dello steff e una senza per poter osservare la riuscita della migrazione addittiva

```
┌──────────────┐     ┌───────────────┐
│   Gateway    │─────│ backend-blue  │────┐
│   (nginx)    │     └───────────────┘    │
│              │                          │
│  switch.sh   │     ┌───────────────┐  ┌─┴──┐
│  cambia la   │─────│ backend-green │──│ db │
│  location    │     └───────────────┘  └────┘
└──────────────┘
```



## 2. Implementazioni Eseguite

### 2.1 Migrazione Addittiva

Dal momento che il file `init.sql` viene eseguito alla creazione del volume viene creato un altro file .sql con all'interno le modifiche da eseguire sul db che verrà eseguito senza doverlo riavviare.

```sql
-- db/migrations/migration_userEmail.sql
ALTER TABLE sio.users
    ADD COLUMN IF NOT EXISTS email VARCHAR(255);
```

> ATTENZIONE!!!
>
> È importante che i campi aggiunti in questo modo sia NULLABLE così da permettere alla vechhia versione di utilizzare il db senza generare errori.


### 2.2 Nuova versione del servizio Staff.js

Nel versione green del backend andiamo a modificare il servizio `staff.js` per fare in modo che lavori anche con il campo *email*.

```javascript
// backend-green/services/staff.js
export const createUserFn = catchAsync(async (req, res, next) => {
	const {username, password, role, email} = req.body;
	const hashedPassword = await bcrypt.hash(password, 12);
	const query = `INSERT INTO users (username, password, role, email)
                   VALUES ($1, $2, $3, $4)
                   RETURNING id, username, role, email`;
	const result = await pool.query(query, [username, hashedPassword, role, email || null]);
	res.status(201).json({status: 'success', data: result.rows[0]});
});
```

### 2.3 Modifica del docker-compose

Dal momento che i backend al momento sono due bisogna modificare il `docker-compose.yml` nel seguente modo:

```yaml
# docker-compose.yml
backend-blue:
  build: ./backend-blue

backend-green:
  build: ./backend-green
```



## 3. Esecuzione della migrazione

Per eseguire la migrazione del db comportarsi come segue:

1. Assicurarsi che i containr docker stiano girando

```bash

docker compose up --build

```

2. Migrazione db

```bash

docker compose exec -T db psql -U sio_user -d sio_db < "db/migrations/migration_userEmail.sql"

```

Ora il db è aggiornato ed è interrogato sia da `backend-blue` che da `backend-green` senza causare errori.

>ATTENZIONE!!!
>
>Se si vuole utilizzare `backend-green` in fe-prod aggiornare il front-end in modo tale che anch'esso gestisca l'utilizzo delle email o comuqnue delle modifiche effettuate

## 4. Test eseguiti

| # | Test | Comando | Risultato Atteso |
|---|------|---------|-------------------|
| 1 | Stato pre-migrazione su Blue | `curl http://localhost/api/users` | Lista utenti, nessun campo `email` |
| 2 | Applicazione migrazione a caldo | `docker compose exec -T db psql -U sio_user -d sio_db < "db/migrations/migration_userEmail.sql"` | Nessun errore, `db` non si riavvia |
| 3 | Blue post-migrazione (non deve rompersi) | `curl http://localhost/api/users` | Identico al Test 1, nessun errore |
| 4 | Blue continua a creare utenti | `curl -X POST http://localhost/api/users -d '{"username":"...","password":"...","role":"DOC"}'` | 201 Created, come prima |
| 5 | Green espone il nuovo campo | `curl http://localhost:8080/api/users` | Lista utenti con campo `email` (null per i record esistenti) |
| 6 | Green scrive l'email | `curl -X POST http://localhost:8080/api/users -d '{"username":"...","password":"...","role":"DOC","email":"test@his-afp.it"}'` | 201 Created, `email` valorizzata |
| 7 | Switch del traffico prod a Green | `./switch.sh green` poi `curl http://localhost/api/users` | Nessuna interruzione, ora risponde Green |
| 8 | Rollback e persistenza dati | `./switch.sh blue` poi verifica DB | L'utente creato al Test 6 resta nel database, invariato |


## 5. Considerazioni e implementazioni future

### 5.1 Considerazioni dello stato attuale

1. **Migrazioni applicate manualmente** — La migrazione è attualmente eseguita a mano per motivi di dimostrazione

2. **Duplicazione di codice tra `backend-blue` e `backend-green`** — Le due verioni di backend sono rappresentate da due cartelle distinte, forte duplicazione di file, in un caso reale le verioni sono create tramite tag Git.
### 5.2 Implementazioni future

1. **Strumenti di migration management dedicati** (Flyway, Liquibase, o `node-pg-migrate` per restare nello stack Node/Postgres già in uso): tengono traccia delle migrazioni già applicate in una tabella di metadati, garantiscono ordine di esecuzione ed espongono comandi `up`/`down` per il rollback dello schema.

2. **Pipeline CI/CD che generi le due versioni automaticamente** a partire da tag Git diversi, così da eliminare la duplicazione manuale delle cartelle e ridurre il rischio di drift tra Blue e Green.