# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup & commands

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to frontend/dist
npm run lint
```

The dev server proxies `/chat`, `/new`, and `/api/agent` to the FastAPI backends (both must be running separately). `generateLyrics` in `api/chat.js` hits `http://localhost:8000/api/lyrics` directly via a hardcoded `LYRICS_API_BASE` — the Vite proxy does not cover `/api/lyrics`.

## Stack

React 19 · Vite 8 · `@vitejs/plugin-react` · Chart.js 4 + react-chartjs-2 · marked (markdown rendering) · No TypeScript.

## Theme system (`src/theme.js`)

All colors, fonts, and spacing tokens live in `theme.js`. The active theme is exported as `theme` (currently `emberTheme`). Import it in every component — never hardcode brand values inline.

| Token | Value | Role |
|---|---|---|
| `theme.primary` | `#c70505` | ABM red — CTAs, accents, logo A |
| `theme.accent` | `#ffc83d` | Gold — highlights, logo B, h2/h3 |
| `theme.accentDeep` | `#e0a418` | Darker gold — active tab pill background |
| `theme.bg` | `#0a0a0b` | Page background |
| `theme.sora` | Sora, sans-serif | Headings, tab labels |
| `theme.inter` | Inter, system-ui | Body text |
| `theme.mono` | IBM Plex Mono | Code, tagline |

To add a new theme, define it in `theme.js` and add it to the `themes` registry. Do not change `ember` theme values without explicit intent.

## Layout architecture (`App.jsx`)

The page is a fixed-height flex column (`100vh`, no page scroll). Three zones:

1. **Top** (`flexShrink: 0`) — `<Header />` + `<TabBar />`. Never scrolls.
2. **Middle** (`flex: 1, minHeight: 0`) — the only scrollable region (`overflowY: auto`). Holds the message feed. `minHeight: 0` on both the flex parent and scroll child is required — removing it breaks overflow.
3. **Bottom** (`flexShrink: 0`) — `<ChatBox />`. Pinned, never scrolls.

When the Artifacts tab is active, the middle+bottom zone is replaced wholesale by `<Artifacts />`. When the Agents tab is active it is replaced by `<Agents />`. Both components replicate the same flex column structure internally.

## Tab bar & routing (`TabBar.jsx`, `App.jsx`)

Tabs are defined as an object array in `TabBar.jsx`:

```js
const TABS = [
  { id: "chat",      label: "Chat Bot"      },
  { id: "artifacts", label: "Artifacts"     },
  { id: "agents",    label: "Agents"        },
  { id: "career",    label: "Career"        },
  { id: "news",      label: "News / Social" },
];
```

`App.jsx` matches `activeTab` (a string id) against the `ARTIFACTS_TAB = "artifacts"` and `AGENTS_TAB = "agents"` constants. Wired tabs:
- `"chat"` → Chat Bot pane (default)
- `"artifacts"` → `<Artifacts />`
- `"agents"` → `<Agents />`

`"career"` and `"news"` highlight the tab but fall through to the Chat pane — not yet wired.

Active tab styling: `theme.accentDeep` background pill. Tab font: Sora 600.

## Artifacts panel (`Artifacts.jsx`)

Internal sub-mode toggle: `"code"` | `"lyrics"`. Both modes are fully functional.

**Code mode** — maintains its own `artifactsSessionId` state for multi-turn refinement. Each generate call passes this session ID to `sendMessage` and updates it from the response. `CODE_INSTRUCTION` instructs the model to modify existing code incrementally (not rebuild) and default to a dark background. Mode switches via `switchMode()` which resets `artifactsSessionId`, `output`, and `error` — intentional so Code and Lyrics contexts don't bleed across switches. `extractCode` strips markdown fences if present; the cleaned HTML is passed to `<CodeArtifact />` for live iframe preview.

**Lyrics mode** — uses `sendMessage` with its own `lyricsSessionId` state, so lyrics within a session are multi-turn (the model sees prior output). Output shown in `<CopyBlock />`. The `lyricsSessionId` is reset by `switchMode()` just like `artifactsSessionId`. Do NOT call `generateLyrics` from `Artifacts.jsx` — that function hits the separate `/api/lyrics` endpoint which is no longer used by this tab.

**`switchMode(next)`** is the only correct way to change mode — do not call `setMode` directly, as it would skip the session and output resets.

## Component conventions

- All styles are inline JS objects defined in a `styles` const at the top of each file. No CSS modules or Tailwind.
- Always import colors/fonts from `theme.js`. The `C` shorthand objects in `Artifacts.jsx` and `CodeArtifact.jsx` are a legacy pattern — do not add more.
- `Bubble.jsx` renders user messages as plain `pre-wrap` text and assistant messages as markdown via `marked.parse()` with a `<style>` block injected inline (`mdStyles`). Do not change the rendering path without updating `mdStyles`.
- `ChartWidget.jsx` requires all Chart.js primitives to be registered at module load — do not remove the `ChartJS.register(...)` call.
- File on disk is `Copyblock.jsx` (lowercase b) but imported everywhere as `CopyBlock`. Match the import casing, not the filename, when referencing it.

## API layer (`src/api/`)

### `chat.js`

`sessionId` is held in module-level scope for the main chat tab. Callers that manage their own session (e.g. Artifacts, Agents) pass it explicitly via the options argument. Three exports:

- `sendMessage(message, mode?, { sessionId?, attachments?, model }?)` — POST `/chat`. Returns `{ answer, chartData, sessionId }`. If `sessionId` is passed in options, the module-level session is not updated (caller owns that session). `model` must always be passed explicitly — there is no default. Attachments are `[{ filename, media_type, data_base64 }]`.
- `newChat()` — POST `/new`, nulls out the module-level `sessionId`.
- `generateLyrics(prompt)` — POST `http://localhost:8000/api/lyrics`, returns `{ lyrics }`. Stateless — no session ID. No longer called by `Artifacts.jsx`; kept for direct use only.

### `agents.js`

Single export:

- `runFinanceAgent(query)` — POST `/api/agent/finance` (proxied to port 8001). Returns `{ price, news, analysis, query }`. Stateless — no session ID.

## ChatBox (`src/components/ChatBox.jsx`)

`onSend(text, attachments, model)` — all three arguments are required by callers. `attachments` is an array of `{ filename, media_type, data_base64 }` objects (empty array when no files attached). `model` is the currently selected model id string.

Internal state: `selectedModel` (default `"gemini"`), `attachments`, `input`. A hidden `<input type="file">` (PDF, images, `.txt`, `.md`) feeds the `attachments` state; selected files are read to base64 via `FileReader`. File chips (filename + × remove button) render above the textarea when files are present. The `⊕ Attach` button is disabled when `isLocal` is true for the selected model; switching to a local model also clears pending attachments. The `⊕ Attach` button uses the same `secondaryBtn` style as `+ New Chat`. Clear attachments after send — already done in `handleSend`.

## Agents panel (`Agents.jsx`)

Renders the Finance Agent UI. Internal state: `mode` (currently only `"Finance Agent"`), `prompt`, `result`, `error`, `loading`.

`handleRun` calls `runFinanceAgent(query)` from `api/agents.js` and stores the structured response in `result`. The response shape is `{ price, news, analysis, query }`:
- **price hero** — ticker chip, exchange badge, current price, day change pill, metrics row (prev close, change, change %)
- **news** — list of `{ title, url, source, date, summary }` cards with hover lift effect
- **analysis** — Claude-generated markdown rendered via `marked.parse()` with the `mdStyles` from `Bubble.jsx`

`exchangeLabel(symbol)` derives the exchange from the ticker suffix (`.NS` → NSE, `.BO` → BSE, else NYSE/NASDAQ). The mode dropdown (`MODES = ["Finance Agent"]`) is wired to `switchMode` for future expansion.
