# PROJECT: NEMESIS // Sortable Superheroes Intelligence Matrix

A high-performance, framework-free web interface built with vanilla JavaScript (ES6 Modules), HTML5, and CSS3 to inspect, search, filter, and sort confidential superhero data.

---

## 1. Project Structure

```
.
├── index.html                    # Markup & accessible control layouts
├── README.md                     # Team guide, architecture breakdown & audit manual
└── src/
    ├── styles/
    │   ├── main.css              # Stylesheet entrypoint (@imports below, in order)
    │   ├── tokens.css            # Design tokens: colors, fonts, radii
    │   ├── base.css              # Reset, page shell, typography
    │   ├── layout.css            # Header, control panel grid, stats bar, table frame
    │   ├── components.css        # Form controls, table, badges, pagination
    │   └── modal.css             # Dossier modal & detail layout
    └── js/
        ├── app.js                # Bootstrap: fetch, listeners, first paint
        ├── config/
        │   └── constants.js      # API URL, defaults, operators, sort directions
        ├── state/
        │   ├── store.js          # Central state object + mutators
        │   └── urlSync.js        # URLSearchParams ↔ state persistence
        ├── utils/
        │   ├── strings.js        # cleanString normalization
        │   └── units.js          # Height/weight unit parsers (cm, kg, m, ft, tons, lb)
        ├── data/
        │   ├── heroApi.js        # Fetch client for the superhero API
        │   ├── normalizeHero.js  # Raw API record → flat hero model
        │   └── heroFields.js     # Numeric field metadata & resolver
        ├── features/
        │   ├── filter.js         # Live search + operators (include/exclude/fuzzy/eq/neq/gt/lt)
        │   ├── sort.js           # Sorting with missing values pinned last
        │   └── pagination.js     # Page slicing, totals, page clamping
        └── ui/
            ├── render.js         # Repaints every dynamic region
            ├── table.js          # Table rows, status rows, sort indicators
            ├── pagination.js     # Record/sort readout + page controls
            ├── dossier.js        # Hero dossier modal
            └── controls.js       # Pushes state into the form controls
```

Modules only import downward through the layers: `ui` → `features` → `data` / `utils` → `state` / `config`.

---

## 2. Team Responsibilities & Ownership

| Member | Area | Core Focus |
| :--- | :--- | :--- |
| **Joe Kolaka** | `src/js/state/store.js`, `src/js/data/`, `src/js/utils/`, `src/js/config/constants.js` | API integration, raw data normalization, unit conversion (cm, kg, tons), and central state management. |
| **Christian Otieno** | `src/js/features/` | Numerical & alphabetical sorting, missing value pinning, live filtering engine, and operator logic (`include`, `exclude`, `fuzzy`, `eq`, `neq`, `gt`, `lt`). |
| **Valentine Omondi** | `src/js/ui/table.js`, `src/js/ui/pagination.js`, `src/js/ui/render.js`, `index.html` | Semantic `<table>` DOM generation, pagination control bounds, batch sizing, and dynamic UI rendering. |
| **Taheera Abdallah** | `src/js/ui/dossier.js`, `src/js/state/urlSync.js`, `src/styles/` | Villain terminal UX/UI design, hero dossier detail modal, and bidirectional `URLSearchParams` state persistence. |

---

## 3. Architecture & Module Design

The codebase relies entirely on browser-native ES6 modules (`type="module"`), eliminating bundlers, build tools, and third-party dependencies.

- **`state/store.js`**: Defines the central `state` singleton. Normalized heroes map `height` and `weight` to standardized numerical units (`cm` and `kg`); string zeroes (`0 cm`, `0 kg`) and empty dashes become `null`.
- **`features/filter.js`**: Pure filter/operator logic. Rebuilds `state.filteredHeroes`, then delegates to sorting and resets paging.
- **`features/sort.js`**: Contains pure transformation algorithms. Enforces that missing values (`null`, `""`, `undefined`) are pushed to the bottom of the table on both ascending and descending sorts.
- **`features/pagination.js`**: Calculates page totals and returns the visible slice; the UI layer only renders it.
- **`ui/table.js` / `ui/pagination.js`**: Handle inner DOM construction and attach `data-hero-id` attributes for row selection.
- **`state/urlSync.js`**: Mirrors all active state (search query `q`, vector `f`, operator `op`, sort column `sc`, sort direction `sd`, page `p`, page size `size`, hero ID `hero`) into the browser URL via `window.history.replaceState`.
- **`app.js`**: Top-level coordinator that wires DOM listeners to the imported state and feature handlers.

---

## 4. Local Development Instructions

Because ES6 modules are subject to browser CORS policies when run directly via the `file://` protocol, the application must be served using an HTTP server.

```bash
# From the project root
python3 -m http.server 8080
```

Then open <http://localhost:8080>.
