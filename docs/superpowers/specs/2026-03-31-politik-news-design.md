# Politik News — Design Spec

## Zusammenfassung

Eine News-Aggregator-Webseite, die automatisch Artikel von konfigurierbaren deutschen Nachrichtenquellen per RSS fetcht, kurze Zusammenfassungen erstellt und diese in einem modernen, politisch gestalteten Interface präsentiert. Artikel werden nach Kategorien (Innenpolitik, Außenpolitik, Wirtschaft, Klima etc.) sortiert und sind nach Thema oder Quelle durchsuchbar. Klick auf einen Artikel führt zur Originalquelle.

## Tech-Stack

- **Backend:** Node.js + Express.js
- **Frontend:** React (Vite) + Tailwind CSS
- **Datenbank:** SQLite (via better-sqlite3)
- **RSS-Parsing:** rss-parser
- **KI-Zusammenfassungen (Fallback):** Claude API oder OpenAI API
- **Cron:** node-cron für regelmäßiges Fetchen
- **Monorepo:** Ein GitHub-Repo mit `/server` und `/client`

## Projektstruktur

```
politik-news/
├── server/
│   ├── src/
│   │   ├── routes/           # API-Endpunkte (articles, categories, sources)
│   │   ├── services/         # RSS-Fetching, Zusammenfassungs-Logik, Kategorisierung
│   │   ├── db/               # SQLite Setup, Migrations, Queries
│   │   ├── config/           # Feed-Konfiguration (Quellen + Kategorien)
│   │   └── index.js          # Express Server Einstiegspunkt
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/       # Wiederverwendbare UI-Komponenten
│   │   ├── pages/            # Home, Kategorie, Suche
│   │   ├── assets/           # Icons, politische Symbole
│   │   └── App.jsx
│   └── package.json
├── package.json              # Root-Scripts (dev, build, start)
└── README.md
```

## Backend

### Feed-Konfiguration

Quellen werden in einer Konfigurationsdatei (`server/src/config/sources.json`) definiert:

```json
[
  {
    "name": "Tagesschau",
    "url": "https://www.tagesschau.de/xml/rss2/",
    "categories": ["Innenpolitik", "Außenpolitik"],
    "logo": "tagesschau.svg"
  }
]
```

Der User gibt die Liste der gewünschten Nachrichtenseiten vor. Jede Quelle wird einer oder mehreren Kategorien zugeordnet.

### RSS-Fetch-Service

- Läuft als Cron-Job alle 15 Minuten via `node-cron`
- Iteriert über alle konfigurierten Quellen
- Parst den RSS-Feed mit `rss-parser`
- Deduplizierung: Artikel werden anhand der URL erkannt, bereits vorhandene übersprungen
- Neue Artikel werden in der SQLite-DB gespeichert

### Zusammenfassungs-Logik

Zweistufiger Ansatz:

1. **Feed-Beschreibung prüfen:** Wenn der RSS-Feed eine Beschreibung liefert, die mindestens 100 Zeichen lang ist und kein reines HTML ist, wird diese als Zusammenfassung verwendet.
2. **KI-Fallback:** Wenn die Feed-Beschreibung unbrauchbar ist (zu kurz, nur HTML-Tags, oder fehlend), wird der Artikelinhalt an die KI-API geschickt mit dem Prompt: "Fasse diesen Nachrichtenartikel in 2-3 Sätzen auf Deutsch zusammen."

Das Ergebnis wird direkt in der DB gespeichert — kein erneuter KI-Aufruf bei Seitenaufrufen.

### Datenbank-Schema (SQLite)

**Tabelle: articles**

| Spalte      | Typ      | Beschreibung                        |
|-------------|----------|-------------------------------------|
| id          | INTEGER  | Primary Key, Auto-Increment         |
| title       | TEXT     | Artikelüberschrift                  |
| url         | TEXT     | Link zum Originalartikel (UNIQUE)   |
| summary     | TEXT     | Zusammenfassung (Feed oder KI)      |
| source      | TEXT     | Name der Quelle (z.B. "Tagesschau")|
| category    | TEXT     | Kategorie (z.B. "Innenpolitik")     |
| image_url   | TEXT     | Bild-URL aus dem Feed (nullable)    |
| published   | TEXT     | Veröffentlichungsdatum (ISO 8601)   |
| fetched_at  | TEXT     | Zeitpunkt des Fetchens              |
| ai_summary  | INTEGER  | 0 = Feed-Beschreibung, 1 = KI      |

**Tabelle: sources**

| Spalte     | Typ     | Beschreibung                    |
|------------|---------|----------------------------------|
| id         | INTEGER | Primary Key                      |
| name       | TEXT    | Anzeigename                      |
| url        | TEXT    | RSS-Feed-URL                     |
| logo       | TEXT    | Pfad zum Logo                    |
| categories | TEXT    | JSON-Array der Kategorien        |

### API-Endpunkte

| Methode | Pfad                        | Beschreibung                                      |
|---------|-----------------------------|----------------------------------------------------|
| GET     | /api/articles               | Artikel-Liste, paginiert (?page=1&limit=20)        |
| GET     | /api/articles?category=...  | Filter nach Kategorie                              |
| GET     | /api/articles/search        | Suche (?q=Suchbegriff&source=Tagesschau)           |
| GET     | /api/categories             | Liste aller Kategorien mit Artikel-Anzahl          |
| GET     | /api/sources                | Liste aller konfigurierten Quellen                 |

## Frontend

### Seiten

**Startseite (`/`):**
- Header: Seitenname "Politik News" mit Logo, Suchleiste, Navigationsleiste mit Kategorien (jeweils mit Icon)
- Hero-Bereich: Die 2-3 neuesten Artikel groß dargestellt — Bild, Überschrift, Zusammenfassung, Quell-Badge
- Darunter: Karten-Grid mit allen weiteren Artikeln chronologisch sortiert
- "Mehr laden"-Button am Ende für Pagination

**Kategorie-Seite (`/kategorie/:name`):**
- Kategorie-Header mit Icon und Name
- Gleicher Karten-Stil, gefiltert auf die gewählte Kategorie
- Pagination wie auf der Startseite

**Such-Seite (`/suche`):**
- Suchfeld prominent oben
- Filter-Sidebar oder Filter-Leiste: nach Quelle, nach Kategorie, nach Zeitraum
- Ergebnisse im Karten-Format

### Komponenten

- **ArticleCard:** Karte mit Quell-Logo, Kategorie-Badge, Überschrift, Zusammenfassung (2-3 Sätze), Datum, "Zum Artikel"-Link
- **HeroArticle:** Große Darstellung für Top-Artikel (Bild-Hintergrund, Overlay-Text)
- **CategoryNav:** Navigationsleiste mit Kategorie-Icons
- **SearchBar:** Suchfeld mit Autocomplete/Vorschlägen
- **SourceBadge:** Kleines Badge mit Quell-Logo und Name
- **FilterPanel:** Filter für Suche (Quelle, Kategorie, Zeitraum)

### Design-System

- **Farbschema:** Dunkles Hauptthema (dunkelblau/dunkelgrau Hintergrund), weißer Text, kräftiger Akzent in Rot oder Blau für Highlights und Interaktionen
- **Typografie:** Moderne Sans-Serif (z.B. Inter oder System-Font-Stack)
- **Kategorien-Icons:** Politische Symbole als visuelle Anker:
  - Innenpolitik: Reichstag/Parlamentsgebäude
  - Außenpolitik: Globus/Weltkarte
  - Wirtschaft: Chart/Balkendiagramm
  - Klima: Blatt/Erde
  - Weitere nach Bedarf
- **Responsive:** Mobile-first, Karten stacken auf kleinen Screens vertikal
- **Tailwind CSS:** Utility-first Styling, dark-mode als Standard

## Kategorien (Initial)

Folgende Kategorien werden initial unterstützt (erweiterbar):

1. Innenpolitik
2. Außenpolitik
3. Wirtschaft
4. Klima & Umwelt
5. Gesellschaft
6. Technologie

## Nicht im Scope (v1)

- User-Accounts / Login
- Kommentarfunktion
- Push-Benachrichtigungen
- Eigene Artikel schreiben
- Dark/Light Mode Toggle (v1 ist nur Dark Mode)
- Admin-Interface zum Verwalten der Quellen (wird über Config-Datei gemacht)
