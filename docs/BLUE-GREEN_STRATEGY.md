# BLUE GREEN Startegy - per aggiornamento backend 

Documentazione tecnica — Blue/Green deployment del Backend

## 1. Architettura della soluzione

Vengono create due istanze del container backend, entrambe collegate allo stesso database, e un Gateway (nginx) che instrada il traffico verso una sola istanza alla volta.

| Componente            | Ruolo                                                     |
|-----------------------|-----------------------------------------------------------|
| `sio-backend-blue`    | Versione stabile attualmente in produzione                |
| `sio-backend-green`   | Nuova versione, avviata in parallelo per il test          |
| `gateway` (nginx)     | Instrada le richieste `/api/` verso blue o green          |
| `db`                  | Database condiviso da entrambe le versioni, invariato     |

## 2. Configurazione Docker Compose

Il servizio backend viene duplicato in due servizi distinti, entrambi collegati allo stesso database. Nessuna delle due istanze espone porte verso l'host: comunicano solo internamente con il gateway.

```yaml
services:
  db:
    # ... configurazione esistente, invariata

  sio-backend-blue:
    build: ./backend
    container_name: sio-backend-blue
    # ... il resto invariato

  sio-backend-green:
    build: ./backend
    container_name: sio-backend-green
    # ... uguale a sopra
```

## 3. Configurazione del Gateway (`default.conf`)

La configurazione originale del Gateway conteneva un riferimento fisso a un unico backend:

```nginx
location /api/ {
    proxy_pass http://sio-backend:3000;
}
```

Questa riga viene modificata per puntare esplicitamente alla versione `blue` (stato iniziale, produzione stabile):

```nginx
location /api/ {
    proxy_pass http://sio-backend-blue:3000;
}
```

Per eseguire il "cambio di binario" verso `green`, si modifica la stessa riga:

```nginx
location /api/ {
    proxy_pass http://sio-backend-green:3000;
}
```

La modifica viene resa effettiva ricaricando la configurazione di nginx senza fermare il servizio, così da non interrompere le connessioni in corso:

```bash
docker compose exec gateway nginx -s reload
```

## 4. Script di switch

Per rendere la procedura ripetibile e dimostrabile, ho fatto uno script che automatizza il cambio di destinazione nel file di configurazione del gateway:

```bash
#!/bin/bash
# switch.sh blue|green
TARGET=$1
sed -i "s/proxy_pass http:\/\/sio-backend-.*:3000;/proxy_pass http:\/\/sio-backend-$TARGET:3000;/" ./default.conf
docker compose exec gateway nginx -s reload
echo "Switched to sio-backend-$TARGET"
```

Utilizzo:

```bash
./switch.sh green   # passa il traffico a green
./switch.sh blue     # rollback immediato a blue
```

## 5. Procedura di test

Di seguito la sequenza di test consigliata per dimostrare il corretto funzionamento della soluzione durante l'esame.

### Test 1 — Avvio dell'ambiente

- Eseguire `docker compose up -d` e verificare con `docker compose ps` che blue, green, gateway e db risultino tutti "Up".
- Confermare che il Gateway punti inizialmente a `sio-backend-blue` nel file `default.conf`.

### Test 2 — Funzionamento su Blue

- Da frontend o con `curl http://localhost/api/health`, verificare una risposta corretta (200 OK).
- Verificare nei log (`docker compose logs sio-backend-blue`) che la richiesta sia stata gestita da blue.

### Test 3 — Verifica isolata di Green prima dello switch

- Testare green direttamente dalla rete interna Docker, senza ancora instradare traffico reale:
  ```bash
  docker compose exec gateway curl http://sio-backend-green:3000/health
  ```
- Questo garantisce che green sia operativo prima di esporlo al traffico reale.

### Test 4 — Switch del traffico (zero-downtime)

- Lanciare, durante lo switch, un ciclo di richieste continue verso `/api/` per dimostrare che non ci sono interruzioni:
  ```bash
  watch -n 0.5 curl http://localhost/api/health
  ```
- Eseguire `./switch.sh green` in un altro terminale.
- Verificare che il ciclo di richieste continui a ricevere risposte 200 OK senza errori né timeout durante e dopo il cambio.
- Confermare nei log che le nuove richieste sono ora gestite da `sio-backend-green`.

### Test 5 — Rollback

- Simulare un bug in green (es. arrestando il container o introducendo un errore volontario).
- Eseguire `./switch.sh blue` e verificare che il traffico torni immediatamente e correttamente a blue, senza downtime percepito dal client.
- Verificare che il tempo di rollback sia dell'ordine di pochi secondi (tempo di reload di nginx), non di un riavvio completo dei container.

## 6. Riflessione richiesta: cosa succede ai dati durante il rollback?

I dati rimangono. Blue e green condividono lo stesso database, quindi qualsiasi scrittura effettuata da green resta persistita anche dopo il rollback del codice applicativo. Il rollback, in questo scenario, riguarda esclusivamente l'instradamento del traffico HTTP a livello di Gateway: non tocca in alcun modo il contenuto del database.

Questo comportamento evidenzia però un limite della soluzione "semplice" adottata: poiché non è prevista alcuna modifica allo schema, non ci sono rischi di incompatibilità tra le versioni. Se invece green avesse introdotto una modifica strutturale al database (es. una nuova colonna obbligatoria) prima di tornare a blue, i dati scritti da green potrebbero risultare incompatibili con ciò che blue si aspetta di leggere o scrivere.
