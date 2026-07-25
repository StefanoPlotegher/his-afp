# Isolamento Infrastrutturale

## 1. Architettura Prima della Migrazione

Prima dell'intervento, l'infrastruttura Docker era configurata **senza reti esplicite**: tutti i servizi condividevano la rete bridge predefinita di Docker (`docker0`).

```
┌───────────────────────────────────────────────────┐
│                   HOST                            │
│                                                   │
│   ┌───────────┐   ┌───────────┐   ┌───────────┐   │
│   │  fe-prod  │   │  fe-test  │   │  fe-sio   │   │
│   │  (porta?) │   │  (porta?) │   │  (porta?) │   │
│   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘   │
│         │               │               │         │
│         └───────────────|───────────────┘         │
│                         │                         │
│                   ┌─────┴─────┐                   │
│                   │  gateway  │  Porte: 80, 8999, │
│                   │  (NGINX)  │  8080 verso host  │
│                   └─────┬─────┘                   │
│                         │                         │
│                   ┌─────┴─────┐   ┌────────────┐  │
│                   │  backend  │   │    db      │  │
│                   │  (Node.js)|   │ (Postgres) │  │
│                   └───────────┘   │ Porta 5432 │  │
│                                   │  verso host│  │
│                                   └────────────┘  │
└───────────────────────────────────────────────────┘
```

### 1.1 Criticità Identificate

1. **Nessun isolamento tra i tier** — un frontend compromesso poteva comunicare direttamente con il database.
2. **Database esposto sull'host** — la porta `5432` era accessibile da qualsiasi macchina in rete, aumentando la superficie d'attacco.
3. **Violazione del principio del minimo privilegio** — ogni container poteva raggiungere qualsiasi altro container senza restrizioni.
4. **Non conformità a standard sanitari** — un'architettura flat non supererebbe un audit di sicurezza per l'accreditamento sanitario regionale (GDPR, normativa dati sanitari).

---

## 2. Architettura Dopo la Migrazione



L'infrastruttura è stata suddivisa in **due reti Docker isolate** collegate esclusivamente dal Gateway.

```
┌─────────────────────────────────────────────────────┐
│                       HOST                          │
│                                                     │
│   ┌───────────┐   ┌───────────┐   ┌───────────┐     │
│   │  fe-prod  │   │  fe-test  │   │  fe-sio   │     │
│   │           │   │           │   │           │     │
│   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘     │
│         │               │               │           │
│         ├── frontend-net (bridge) ──────┤           │
│         │               │               │           │
│         └───────────────|───────────────┘           │
│                         │                           │
│                   ┌─────┴─────┐                     │
│                   │  gateway  │  Porte: 80, 8999,   │
│                   │  (NGINX)  │  8080 verso host    │
│                   └─────┬─────┘                     │
│                         │                           │
│                  ┌──────┴──────┐                    │
│                  │  backend-net (bridge + internal) │
│                  ├─────────────┤                    │
│            ┌─────┴─────┐  ┌────┴─────┐              │
│            │  backend  │  │    db    │              │
│            │ (Node.js) │  │(Postgres)│              │
│            └───────────┘  └──────────┘              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2.1 Definizione delle Reti

| Rete            | Driver    | Internal | Servizi Collegati                         |

| `frontend-net`  | `bridge`  | No       | `fe-prod`, `fe-test`, `fe-sio`, `gateway` |
| `backend-net`   | `bridge`  | **Sì**   | `backend`, `db`, `gateway`                |

### 2.2 Assegnazione dei Servizi

| Servizio  | Rete(i)                       | Porte esposte sull'host |

| `db`      | `backend-net`                 | Nessuna                 |
| `backend` | `backend-net`                 | Nessuna                 |
| `fe-prod` | `frontend-net`                | Nessuna                 |
| `fe-test` | `frontend-net`                | Nessuna                 |
| `fe-sio`  | `frontend-net`                | Nessuna                 |
| `gateway` | `frontend-net`, `backend-net` | `80`, `8999`, `8080`    |

### 2.3 Flusso del Traffico

1. L'utente raggiunge il Gateway sulle porte `80` (produzione), `8999` (sviluppo) o `8080` (test).
2. Il Gateway instrada le richieste statiche verso il frontend corrispondente (sulla `frontend-net`).
3. Il Gateway instrada le richieste API (`/api/*`) verso il backend (sulla `backend-net`).
4. Il backend interroga il database (sulla `backend-net`).
5. Il database **non è mai raggiungibile** dai frontend né dall'esterno.

---

## 3. Motivazioni della Migrazione

### 3.1 Conformità Normativa e Accreditamento Sanitario

Il sistema gestisce dati sanitari di pazienti (nome, cognome, codice fiscale, diagnosi, colori di triage). La normativa GDPR (Regolamento UE 2016/679) e il DLgs 101/2018 impongono misure tecniche adeguate a proteggere i dati personali. Un'architettura a rete piatta non supererebbe un audit di sicurezza per l'accreditamento sanitario regionale.

### 3.2 Principio del Minimo Privilegio

Ogni container dovrebbe avere accesso **solo** alle risorse necessarie al suo funzionamento. Prima della migrazione:
- I frontend potevano comunicare direttamente con il database (nessuna necessità funzionale).
- Il database era esposto sulla rete locale (nessuna necessità).

Dopo la migrazione:
- I frontend vedono solo altri frontend e il gateway.
- Il database è invisibile a chiunque non sia sulla `backend-net`.

### 3.3 Mitigazione del Rischio di Compromissione

In caso di compromissione di un frontend (es. tramite XSS o vulnerabilità lato client), un attaccante non avrebbe alcuna via di rete per raggiungere il database o il backend direttamente. Dovrebbe necessariamente passare dal Gateway, che è un punto di controllo centralizzato dove applicare policy di sicurezza, rate limiting, autenticazione e logging.

---

## 4. Scelta Tecnica: `internal: true` su `backend-net`

### 4.1 Perché abbiamo scelto `internal: true`

Abbiamo configurato la rete `backend-net` con l'opzione `internal: true`. Questo significa che, oltre all'isolamento tra reti, **i container su `backend-net` non hanno alcun accesso in uscita verso internet**.

Vantaggi:
- **Protezione da esfiltrazione dati** — se il backend venisse compromesso, non potrebbe inviare dati all'esterno.
- **Riduzione superficie d'attacco** — niente aggiornamenti incontrollati, niente connessioni esterne non autorizzate.
- **Massima sicurezza per un ambiente sanitario** — il database non ha alcun contatto con l'esterno.

### 4.2 Come ripristinare l'accesso internet in futuro

Se in futuro il backend dovesse aver bisogno di connettersi a servizi esterni (es. API REST di terze parti, servizi di autenticazione esterni), ci sono due strategie:

**Opzione A — Rimuovere `internal: true` (semplice)**
```yaml
backend-net:
  driver: bridge
  # internal: true   # <- commentare o rimuovere
```
Il backend tornerebbe ad avere accesso internet ma resterebbe comunque isolato dalla `frontend-net`.

**Opzione B — Proxy dedicato su `backend-net` (più sicura)**
Aggiungere un container proxy (es. Squid, NGINX) configurato su `backend-net` come unico punto di uscita verso internet, con policy di whitelist per domini consentiti. Questo mantiene il principio del minimo privilegio pur permettendo connettività selettiva.

---

## 5. Limitazioni e Proposte di Miglioramento

### 5.1 Limitazioni dell'Architettura Attuale

1. **Gestione manuale delle configurazioni NGINX** — ogni modifica alle route richiede l'editing di `gateway/default.conf` e il reload del container.
2. **Nessun service discovery dinamico** — i nomi dei container sono hardcodati nel file di configurazione del gateway.
3. **Nessun rate limiting centralizzato** — il gateway non implementa policy di throttling per proteggere il backend da abusi.
4. **Nessuna crittografia TLS** — le comunicazioni avvengono in chiaro su HTTP (anche se in un contesto formativo è accettabile).

### 5.2 Cosa Cambieremmo in un'ottica Moderna

#### 5.2.1 Sostituire NGINX con Traefik come Reverse Proxy

Traefik offre:
- Service discovery automatico tramite label Docker (nessuna configurazione manuale).
- Supporto nativo per TLS/SSL con Let's Encrypt automatico.
- Rate limiting, circuit breaker, retry policy integrati.
- Dashboard di monitoraggio integrata.
- Middleware per autenticazione, redirect, whitelist IP.

```yaml
# Esempio di configurazione Traefik via label Docker
services:
  fe-prod:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.fe-prod.rule=Host(`prod.his-afp.local`)"
      - "traefik.http.services.fe-prod.loadbalancer.server.port=80"
```

#### 5.2.2 Orchestratore Kubernetes con NetworkPolicy

Kubernetes porterebbe:
- **NetworkPolicy** — policy di rete dichiarative e granulari (es. "solo i pod con label `tier:frontend` possono comunicare con il gateway").
- **Secrets management** nativo per credenziali e JWT.
- **Service Mesh (Istio/Linkerd)** — crittografia mTLS tra tutti i pod, observability distribuita, traffic splitting per canary deploy.
- **Ingress Controller** — punto di ingresso unico con routing avanzato.

```yaml
# Esempio di NetworkPolicy per replicare l'isolamento attuale
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-isolation
spec:
  podSelector:
    matchLabels:
      tier: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: gateway
```

#### 5.2.3 Feature Flags Dinamici

Invece di iniettare variabili d'ambiente all'avvio dei container (`APP_ENV`, `APP_VERSION`), si potrebbero utilizzare Feature Flag services (es. LaunchDarkly, ConfigCat, o una soluzione self-hosted con Unleash) per modificare il comportamento dell'applicazione in runtime senza dover ricostruire o riavviare i container.

---

## 6. Guida ai Test


### 6.1 Verifica dell'Isolamento di Rete

I seguenti test verificano che i container frontend **non possano** raggiungere il database.

```bash
# Test 1: fe-prod NON deve poter pingare il database
docker exec fe-prod ping db
# Risultato atteso: "ping: bad address 'db'" o timeout
```

```bash
# Test 2: fe-prod NON deve poter pingare il backend
docker exec fe-prod ping sio-backend
# Risultato atteso: "ping: bad address 'sio-backend'" o timeout
```

```bash
# Test 3: il backend DEVE poter pingare il database
docker exec sio-backend ping db
# Risultato atteso: risposta con tempi di ping
```

```bash
# Test 4: il gateway DEVE poter raggiungere sia frontend che backend
docker exec sio-gateway ping fe-prod
# Risultato atteso: risposta con tempi di ping

docker exec sio-gateway ping sio-backend
# Risultato atteso: risposta con tempi di ping
```

```bash
# Test 5: la porta 5432 NON deve essere accessibile dall'host
# (dovrebbe fallire o rifiutare la connessione)
curl http://localhost:5432
# oppure
telnet localhost 5432
# Risultato atteso: "Connection refused" o timeout
```

### 6.2 Verifica del Gateway (Unico Punto di Accesso)

Tutti i test funzionali devono passare dal Gateway e non direttamente ai container.

```bash
# Test 6: Verifica che solo il gateway esponga porte sull'host
docker container ls --format "table {{.Names}}\t{{.Ports}}"
# Risultato atteso: solo sio-gateway mostra porte mappate
```

### 6.3 Riepilogo dei Test

| #  | Test                            | Comando                                                     | Risultato Atteso   |

| 1  | Isolamento fe-prod → db         | `docker exec fe-prod ping db`                               | Fallimento         |
| 2  | Isolamento fe-prod → backend    | `docker exec fe-prod ping sio-backend`                      | Fallimento         |
| 3  | Connettività backend → db       | `docker exec sio-backend ping db`                           | Successo           |         
| 4  | Connettività gateway → tutti    | `docker exec sio-gateway ping fe-prod` e `ping sio-backend` | Successo           |         
| 5  | Porta db non esposta            | `curl localhost:5432`                                       | Rifiutato          |
| 6  | Solo gateway ha porte           | `docker container ls`                                       | Solo `sio-gateway` |


