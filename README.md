# Jakten på kjærligheten

Sanntids bingo-scavenger hunt-app bygget for Synne & Aksels bryllup i Italia 🇮🇹

Lag konkurrerer om å fullføre 9 oppgaver plassert rundt gården. Oppgavene låses opp med fysiske stasjonskoder, og poengstillingen oppdateres live på alle enheter via Firebase.

---

## Innhold

- [Kom i gang (lokal utvikling)](#kom-i-gang-lokal-utvikling)
- [Appens oppbygning](#appens-oppbygning)
- [Spillogikk](#spillogikk)
- [Admin-tilgang](#admin-tilgang)
- [Firebase](#firebase)
- [Tredjeparter og avhengigheter](#tredjeparter-og-avhengigheter)
- [Justere oppgaver og kartpins](#justere-oppgaver-og-kartpins)
- [Deploy til Netlify](#deploy-til-netlify)
- [Etter bryllupet](#etter-bryllupet)

---

## Kom i gang (lokal utvikling)

### Forutsetninger

- Node.js 18+ og npm

### Installasjon

```bash
git clone <repo-url>
cd jakten-pa-kjaerligheten
npm install
```

### Miljøvariabler

Kopier `.env`-filen (den finnes allerede i repoet med gyldige verdier). Filen ser slik ut:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ADMIN_PW=italia2025
```

> `.env` er i `.gitignore` og pushes ikke til GitHub. Oppbevar den trygt.

### Start utviklingsserver

```bash
npm run dev
```

Åpne [http://localhost:5173](http://localhost:5173).

### Produksjonsbygg

```bash
npm run build       # bygger til dist/
npx vite preview    # test produksjonsbygget lokalt
```

---

## Appens oppbygning

### Tech stack

| Teknologi | Versjon | Bruk |
|-----------|---------|------|
| React | 18 | UI-rammeverk |
| TypeScript | 5 | Statiske typer |
| Vite | 6 | Byggesteg og dev-server |
| Tailwind CSS | 4 | Styling (via `@tailwindcss/vite`) |
| Firebase Realtime Database | SDK v11 | Sanntids datasynkronisering |
| React Router | 7 | Klientsiderouting (SPA) |
| Netlify | — | Hosting og deploy |

### Filstruktur

```
jakten-pa-kjaerligheten/
├── public/
│   └── map.png                   — satelittbilde av gården (serveres statisk)
├── src/
│   ├── types/
│   │   └── index.ts              — alle TypeScript-typer og spillkonstanter
│   ├── lib/
│   │   ├── firebase.ts           — Firebase-initialisering (leser fra .env)
│   │   └── gameLogic.ts          — rene spillfunksjoner + DEFAULT_TASKS
│   ├── hooks/
│   │   ├── useFirebase.ts        — enkelt onValue-abonnement + skrive-hjelpere
│   │   ├── useTeam.ts            — sesjonshåndtering via sessionStorage
│   │   ├── useTimer.ts           — lokal 1-sekundsklokke fra Firebase-timer
│   │   └── useTasks.ts           — grid-beregning og tellehjelpere
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx     — Firebase Context-leverandør + sesjonsvakt
│   │   │   ├── TimerBar.tsx      — sticky nedtellingslinje øverst
│   │   │   ├── BottomNav.tsx     — navigasjon i bunn
│   │   │   └── ScreenHero.tsx    — branded topptekst
│   │   ├── bingo/
│   │   │   ├── BingoBoard.tsx    — 3×3 rutenett med rad-/kolonneoverskrifter
│   │   │   └── BingoCell.tsx     — enkelt felt med status-farger
│   │   ├── task/
│   │   │   ├── TaskModal.tsx     — bottom sheet-modal
│   │   │   └── TaskForm.tsx      — stasjonskode + svarskjema per oppgavetype
│   │   ├── leaderboard/
│   │   │   └── Leaderboard.tsx   — sortert poengliste med medaljer
│   │   ├── map/
│   │   │   ├── MapView.tsx       — kartbilde med pins + oppgaveliste
│   │   │   └── MapPin.tsx        — enkelt pin posisjonert med %-koordinater
│   │   └── admin/
│   │       ├── AdminOverview.tsx — statistikk og live stilling
│   │       ├── AdminTeams.tsx    — godkjenning av oppgaver + bonuspoeng
│   │       ├── AdminTaskList.tsx — liste alle oppgaver med rediger/slett
│   │       └── AdminTaskEditor.tsx — skjema for å opprette/redigere oppgaver
│   ├── pages/
│   │   ├── SetupPage.tsx         — registrering av lag og admin-innlogging
│   │   ├── BingoPage.tsx         — hovedskjermen med bingobretten
│   │   ├── LeaderboardPage.tsx   — poengoversikt
│   │   ├── MapPage.tsx           — kart med pinneplassering
│   │   └── AdminPage.tsx         — admin-panel med timer og oppgavestyring
│   ├── App.tsx                   — React Router-konfigurasjon
│   ├── main.tsx                  — applikasjonsinngang
│   ├── index.css                 — Tailwind v4-import + @theme-farger
│   └── vite-env.d.ts             — TypeScript-typer for import.meta.env
├── index.html                    — Vite entry point
├── vite.config.ts                — Vite + Tailwind plugin
├── netlify.toml                  — bygg- og redirect-konfigurasjon
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── package.json
└── .env                          — Firebase-credentials (ikke i git)
```

### Dataflyt

```
Firebase Realtime Database
        │
        │  onValue('/') — ett abonnement per sesjon
        ▼
   AppLayout (AppContext)
        │
        ├── BingoPage ──► BingoBoard ──► BingoCell
        │       └──────────────────────► TaskModal ──► TaskForm
        ├── LeaderboardPage ──► Leaderboard
        ├── MapPage ──► MapView ──► MapPin
        └── AdminPage ──► Admin{Overview,Teams,TaskList,TaskEditor}
```

`useFirebase` mountes **kun i `AppLayout`** — ett `onValue`-abonnement for hele sesjonen. Alle undersider henter data via `useApp()` (React Context). Dette sikrer sanntidsoppdateringer på tvers av faner uten duplikate Firebase-tilkoblinger.

### Ruting

| Rute | Komponent | Tilgang |
|------|-----------|---------|
| `/` | `SetupPage` | Alle |
| `/bingo` | `BingoPage` | Innloggede lag |
| `/leaderboard` | `LeaderboardPage` | Innloggede lag |
| `/map` | `MapPage` | Innloggede lag |
| `/admin` | `AdminPage` | Admin |
| `/*` | Redirect til `/` | — |

Uautentiserte brukere som prøver å navigere til `/bingo` e.l. sendes automatisk tilbake til `/`.

### Sesjonshåndtering

Sesjonsdata lagres i `sessionStorage` (ikke `localStorage`) under nøkkelen `jakten_session`. Det betyr:

- Sesjonen overlever sideinnlasting og navigasjon
- Sesjonen forsvinner når nettleserfanen lukkes
- Flere enheter kan logge inn med samme lagnavn + symbol og se samme data

Team-nøkkelen er deterministisk: `teamName + teamIcon` (f.eks. `"Viva la Vita🦁"`). Den brukes som nøkkel i Firebase og i sessionStorage.

---

## Spillogikk

### Bingobretten

3×3 rutenett med tre kolonner (Trivia, Fysisk, Brains) og tre rader (10, 20, 30 poeng).

### Oppgavetyper

| Type | Beskrivelse | Godkjenning |
|------|-------------|-------------|
| `quiz` | Tekstsvar, sammenlignes med fasit | Automatisk |
| `multi` | Flere felt med hvert sitt svar | Automatisk (hvis fasit er satt) / admin |
| `admin` | Fysisk aktivitet eller kreativ oppgave | Alltid manuelt av admin |

### Stasjonskode

Hvert oppgavekort på gården har en 4-sifret kode. Laget må taste inn koden for å låse opp svarfeltet. Koden sjekkes eksakt (ingen normalisering).

### Poengberegning

```
lagPoeng = Σ (fullførte oppgavers poeng) + adminBonuspoeng
```

`norm(s)` brukes ved sammenligning av tekstsvar: lowercase + fjern alle mellomrom + trim. `"Oslo"`, `" oslo "` og `"OSLO"` gir alle treff mot fasiten `"oslo"`.

### Oppgavestatus

| Status | Betyr |
|--------|-------|
| Ikke i `done` | Ikke startet |
| `done[id] = "pending"` | Innlevert, venter på admin |
| `done[id] = true` | Godkjent og fullført |

---

## Admin-tilgang

### Innlogging

På startskjermen (`/`): scroll ned til **Admin-innlogging**, skriv inn passordet og klikk **Logg inn**.

**Passord:** `italia2025`  
*(Endres i `.env` → `VITE_ADMIN_PW=nyttpassord`, deretter nytt bygg og deploy)*

### Admin-panelet

Admin ser en ekstra fane (**Admin**) i bunnmenyen. Panelet har fire seksjoner:

**Oversikt**
- Antall lag og antall oppgaver som venter godkjenning
- Live poengtabell
- «Reset alle lag» — sletter all lagdata (irreversibelt)

**Lag**
- Se alle registrerte lag med poeng og status
- Godkjenn eller avvis ventende oppgaver per lag
- Sett manuelle bonuspoeng per lag

**Oppgaver**
- Liste alle 9 (eller flere) oppgaver
- Rediger tittel, tekst, kode, fasit, type, posisjon
- Slett oppgaver
- Endringer lagres øyeblikkelig i Firebase og vises på alle enheter

**Ny oppgave / Rediger**
- Skjema for å opprette eller redigere én oppgave
- Felter: ID, kode, tittel, kolonne (0–2), rad (0–2), poeng (10/20/30), type, spørsmål
- For `quiz`: fasitsvar + hint
- For `multi`: opptil 4 label/fasit-par (tom fasit = ingen automatisk sjekk)

### Nedtelling (timer)

- Sett antall minutter og klikk **Start**
- Timerbaren vises øverst på alle skjermer (alle lag ser den)
- Fargen skifter til oransje når det er under 10 minutter igjen
- «Tid er ute! ⏰» vises når telleren når null

---

## Firebase

### Prosjekt

- **Prosjekt-ID:** `appitalia-2b302`
- **Database-URL:** `https://appitalia-2b302-default-rtdb.europe-west1.firebasedatabase.app`
- **Region:** Europa (europe-west1)

### Datastruktur

```json
{
  "teams": {
    "LagnøkkelMedSymbol🦁": {
      "key": "LagnøkkelMedSymbol🦁",
      "name": "Lagnavn",
      "icon": "🦁",
      "done": {
        "1a": true,
        "2b": "pending"
      },
      "adminPts": 0
    }
  },
  "tasks": {
    "1a": {
      "id": "1a", "col": 0, "row": 0, "pts": 10,
      "type": "quiz", "code": "1111",
      "title": "Q1: Møtet",
      "question": "...", "answer": "2018", "hint": "..."
    }
  },
  "timer": {
    "running": true,
    "endsAt": 1748600000000,
    "minutes": 90
  }
}
```

### Skriverettigheter

Hvert lag skriver **kun til sin egen node** (`/teams/{lagNøkkel}`). Oppgaver og timer skrives kun av admin-klienten (ingen serverside-håndhevelse — appen stoler på klienten).

Anbefalte Firebase Security Rules under selve bryllupet:

```json
{
  "rules": {
    "teams": {
      "$teamKey": {
        ".read": true,
        ".write": true
      }
    },
    "tasks": {
      ".read": true,
      ".write": true
    },
    "timer": {
      ".read": true,
      ".write": true
    }
  }
}
```

### Første kjøring

Hvis databasen er tom ved oppstart, seeder `useFirebase` automatisk `tasks/` med `DEFAULT_TASKS` fra `src/lib/gameLogic.ts`. Dette skjer kun én gang. Etterfølgende endringer gjøres via admin-panelet.

---

## Tredjeparter og avhengigheter

### Kjøretidsavhengigheter

| Pakke | Versjon | Lisens | Bruk |
|-------|---------|--------|------|
| `react` + `react-dom` | 18 | MIT | UI-rammeverk |
| `firebase` | 11 | Apache 2.0 | Realtime Database SDK |
| `react-router-dom` | 7 | MIT | Klientsiderouting |

### Utviklingsavhengigheter

| Pakke | Versjon | Lisens | Bruk |
|-------|---------|--------|------|
| `vite` | 6 | MIT | Byggesteg og dev-server |
| `@vitejs/plugin-react` | 4 | MIT | React-støtte i Vite |
| `tailwindcss` | 4 | MIT | CSS-rammeverk |
| `@tailwindcss/vite` | 4 | MIT | Tailwind v4 Vite-plugin |
| `typescript` | 5 | Apache 2.0 | Statisk typesjekking |

### Eksternt CDN (lastes i nettleser)

| Ressurs | URL | Bruk |
|---------|-----|------|
| Tabler Icons | `cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0` | Ikonfonter i UI |

Tabler Icons lastes via CDN i `index.html`. Krever internettilgang ved bruk. Hvis appen skal brukes offline, last ned fontfilene og legg dem i `public/`.

### Tredjepartstjenester

| Tjeneste | Bruk | Datadeling |
|----------|------|-----------|
| Firebase (Google) | Sanntids database | Lagdata, oppgaver, timer |
| Netlify | Hosting og deploy | Statiske filer |
| jsDelivr CDN | Ikonfonter | Ingen brukerdata |

---

## Justere oppgaver og kartpins

### Endre oppgaver

**Under bryllupet:** Bruk admin-panelet → **Oppgaver** → **Rediger**.

**I kildekoden** (for å endre standardoppgavene som brukes ved første kjøring): rediger `DEFAULT_TASKS` i [src/lib/gameLogic.ts](src/lib/gameLogic.ts).

Felter per oppgave:

| Felt | Type | Beskrivelse |
|------|------|-------------|
| `id` | string | Unik ID, f.eks. `"1a"` |
| `col` | 0\|1\|2 | Kolonne (Trivia/Fysisk/Brains) |
| `row` | 0\|1\|2 | Rad (10/20/30 poeng) |
| `pts` | 10\|20\|30 | Poengverdi |
| `type` | quiz\|multi\|admin | Oppgavetype |
| `code` | string | 4-sifret stasjonskode |
| `title` | string | Kort tittel vist i grid |
| `question` | string | Fullstendig oppgavetekst |
| `answer` | string? | Fasitsvar (kun quiz) |
| `hint` | string? | Hint til spillerne (kun quiz) |
| `fields` | array? | Feltnavn + fasit (kun multi) |

### Justere kartpins

Pin-koordinater redigeres i [src/types/index.ts](src/types/index.ts):

```ts
export const MAP_POS: Record<string, { x: number; y: number }> = {
  '1a': { x: 18, y: 22 },  // x = % fra venstre, y = % fra topp
  // ...
}
```

Kartet er bildet `public/map.png`. Juster `x`/`y` (0–100) til pinnene stemmer med faktisk stasjonplassering.

---

## Deploy til Netlify

### Automatisk (anbefalt)

1. Push repoet til GitHub
2. Gå til [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Velg repoet
4. Build-innstillinger hentes fra `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Legg til miljøvariablene under **Site settings → Environment variables** (samme som i `.env`)
6. Klikk **Deploy**

### Manuelt (drag-and-drop)

```bash
npm run build
```

Dra `dist/`-mappen til Netlify Dashboard → **Deploys → Drag and drop**.

**Merk:** SPA-routing fungerer i produksjon via `[[redirects]]`-regelen i `netlify.toml` som sender alle forespørsler til `index.html`.

---

## Etter bryllupet

### Lås ned Firebase

Gå til Firebase Console → Realtime Database → Regler, og lim inn:

```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

### Ta ned Netlify-appen

Gå til Site settings → Danger zone → **Delete site**, eller sett opp passordsbeskyttelse under **Access control**.

### Nullstill lagdata

Logg inn som admin → Oversikt → **Reset alle lag**. Dette sletter all lagdata men beholder oppgavene.
