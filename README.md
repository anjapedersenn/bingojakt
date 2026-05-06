# Jakten på kjærligheten

Scavenger hunt-app til Synne & Aksels bryllup i Italia 🇮🇹

## Kom i gang

### 1. Sett opp Firebase Realtime Database

1. Gå til [console.firebase.google.com](https://console.firebase.google.com)
2. Åpne prosjektet **appitalia-2b302**
3. Velg **Realtime Database** i menyen
4. Klikk **Opprett database** og velg region (Europa anbefales)
5. Under **Regler**, lim inn dette og klikk **Publiser**:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
6. Kopier database-URL-en (vises øverst i Realtime Database-siden)
   - Format EU: `https://appitalia-2b302-default-rtdb.europe-west1.firebasedatabase.app`
   - Format US: `https://appitalia-2b302-default-rtdb.firebaseio.com`

### 2. Oppdater databaseURL i index.html

Åpne `index.html` og finn linjen:
```js
databaseURL: "https://appitalia-2b302-default-rtdb.europe-west1.firebasedatabase.app",
```
Erstatt med den faktiske URL-en fra steg 6 over.

---

## Endre admin-passord

Åpne `index.html` og finn øverst i script-seksjonen:
```js
const ADMIN_PW = "italia2025"; // BYTT DETTE!
```
Endre til ønsket passord.

---

## Endre oppgaver

### Via admin-panelet (anbefalt under bryllupet)
1. Logg inn som admin
2. Gå til **Oppgaver**-fanen
3. Klikk **+ Ny oppgave** eller rediger eksisterende

Endringer lagres direkte i Firebase og reflekteres umiddelbart på alle enheter.

### Via kildekoden (for å endre startoppgavene)
Åpne `index.html` og finn `DEFAULT_TASKS`-arrayen. Disse brukes **kun** hvis databasen er tom ved første kjøring. Hvis databasen allerede har data, ignoreres DEFAULT_TASKS.

For å nullstille og bruke nye DEFAULT_TASKS: logg inn som admin → Oversikt → **Reset alle lag** (dette sletter lagdata, men ikke oppgaver). For å slette oppgaver, bruk admin-panelet.

---

## Justere kartpins

Åpne `index.html` og finn:
```js
const MAP_POS = {
  "1a":{x:18,y:22}, ...
};
```
`x` og `y` er prosent fra venstre/topp av kartbildet (0–100). Juster verdiene slik at pinnene stemmer med faktisk plassering på `map.jpg`.

---

## Deploy til Netlify

1. Push repoet til GitHub
2. Gå til [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Velg GitHub-repoet
4. Build-innstillinger fylles automatisk fra `netlify.toml` (ingen build-kommando nødvendig)
5. Klikk **Deploy**

Appen får en URL som `https://din-site.netlify.app`. Del denne med gjestene.

---

## Filstruktur

```
jakten-pa-kjaerligheten/
├── index.html      — hele appen (én fil, ingen build-steg)
├── map.jpg         — satelittbilde av gården
├── netlify.toml    — Netlify-konfigurasjon
└── README.md       — denne filen
```

---

## Etter bryllupet

Lås ned Firebase-reglene for å forhindre skriving:
```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```
