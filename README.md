# SeedLog

SeedLog is a local-first prototype for an idea-growth centered productivity app.

## Current MVP

- Daily capture by date
- Focus Today execution view
- Priority board by lane
- Line-by-line item parsing
- Lightweight task / idea / note / question classification
- Short-term / long-term horizon tagging
- Keyword extraction
- Automatic idea thread grouping
- Manual thread naming
- Thread detail view with next actions, timeline, and growth prompts
- Project brief metadata for goals, target dates, milestones, and success criteria
- Local AI provider abstraction with thread-level next-step suggestions
- Priority model: lane, importance, momentum
- Manual priority controls on daily items
- Monthly review/reflection dashboard with flow, friction, project pulse, and prompts
- SQLite item storage in Tauri
- Browser localStorage fallback
- JSON import/export

## Run

Browser prototype:

```bash
npm run dev:frontend
```

Then open `http://127.0.0.1:5174`.

Static frontend build:

```bash
npm run build:frontend
```

This creates `dist/` with only the files Tauri should package.

Mini quick capture:

```text
http://127.0.0.1:5174/mini.html
```

The mini capture page is designed for a future Windows portable/Tauri helper:
paste simple AM/PM notes, save them to a local queue, then download or copy a
SeedLog-compatible JSON file and import it from the main app.

SeedLog Capture portable app:

```bash
npm run tauri:capture:dev
```

This opens the compact `mini.html` capture surface as its own Tauri app.

To create a normal desktop bundle:

```bash
npm run tauri:capture:build
```

To create a portable raw executable without an installer bundle:

```bash
npm run tauri:capture:portable
```

The portable executable is copied to `dist-portable/SeedLog-Capture` on macOS
and Linux, or `dist-portable/SeedLog-Capture.exe` on Windows. For a Windows
`.exe`, run the same command on Windows or set up a Windows cross-build target
later.

To force a Windows x64 portable target from a Windows build machine:

```bash
npm run tauri:capture:portable:x64
```

If you cannot install Rust or Visual Studio tools on the Windows machine where
you want to use the app, use the GitHub Actions workflow at
`.github/workflows/build-windows-capture.yml`. It builds the Windows x64
portable executable on a hosted Windows runner and uploads
`SeedLog-Capture.exe` as an artifact.

Tauri desktop app:

```bash
npm install
npm run tauri:dev
```

The desktop window opens automatically. Tauri also starts the local frontend at
`http://localhost:5173` during development.

## Ollama Suggestions

Thread Detail includes a provider selector for next-step suggestions.

- `Local Rules`: works offline with deterministic local heuristics.
- `Ollama`: calls `http://127.0.0.1:11434/api/generate`.
- `OpenAI-ready`: placeholder for a future provider.

To use Ollama locally:

```bash
ollama serve
ollama pull llama3.2
```

Then select `Ollama` in the Thread Detail suggestion panel and keep the model
field as `llama3.2`, or replace it with another local model you have pulled.
If Ollama is not running, SeedLog falls back to `Local Rules`.

## Tauri / Rust Map

- `package.json`: Node scripts and Tauri CLI dependency.
- `src-tauri/tauri.conf.json`: desktop window, app identifier, dev URL, bundle settings.
- `src-tauri/Cargo.toml`: Rust package manifest and Tauri crate dependencies.
- `src-tauri/src/main.rs`: desktop entry point.
- `src-tauri/src/lib.rs`: Tauri app builder.
- `src-tauri/migrations/001_create_seedlog_items.sql`: SQLite item schema.
- `src-tauri/migrations/002_create_thread_overrides.sql`: custom thread title schema.
- `src-tauri/migrations/003_add_priority_fields.sql`: lane, importance, and momentum fields.
- `src-tauri/migrations/004_create_project_meta.sql`: project brief metadata schema.
- `src-tauri/icons/icon.png`: temporary RGBA app icon.

## SQLite

SeedLog stores daily items in `sqlite:seedlog.db` through the Tauri SQL plugin.
On macOS during development, the file is created at:

```text
~/Library/Application Support/com.seedlog.app/seedlog.db
```

The browser-only prototype still uses `localStorage`, so the same frontend can
run both inside Tauri and at `http://localhost:5173`.

Thread groups are still computed from items at runtime. Custom thread names are
stored separately in `thread_overrides`, which lets the analysis logic improve
without rewriting the original daily records.

Project-level details are stored in `project_meta` by thread id. This keeps
daily captures immutable while allowing a thread to grow into a project with a
goal, target date, next milestone, success criteria, status, and notes.

Each item also stores three priority dimensions:

- `lane`: `now`, `next`, `build`, `invest`, or `someday`.
- `importance`: `low`, `normal`, `high`, or `critical`.
- `momentum`: `seed`, `active`, `blocked`, `stale`, or `done`.

## Next Steps

- Connect OpenAI provider behind the existing suggestion interface
- Add Windows quick capture client and Android reminder client
