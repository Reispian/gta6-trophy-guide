# Leonida Platinum Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Reispian/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Reispian/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: every trophy with its official name, description and grade, a guide in our own words with cited sources, a six-stage roadmap to the platinum, missable flags, filters, a spoiler setting, and progress saved in the browser with export/import.

## What it covers

- **55 trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze; 28 of them hidden on PlayStation until earned. Names, descriptions and grades are the official list as published by Exophase and PSNProfiles.
- **A guide for every trophy**, written in our own words, each naming its sources (Exophase, PSNProfiles, PowerPyx, GTABase, Output Lag). No guide text is copied from another guide.
- **Roadmap to the platinum** in six stages: story, side characters & strangers, robberies & partner jobs, activities & races, collectibles & exploration, then the 100% cleanup for A Long Road.
- **The one missable trophy** — Positive Mental Attitude — flagged everywhere, with the Chapter 1 balcony meditation spelled out and a warning to keep a manual save at the start of every chapter (there is no mission replay).
- **Tracker**: tick trophies off and progress is saved in the browser (localStorage); export it to a file and import it back. Filters for story, missable, collectibles, activities and online (there are no online trophies — all 55 are single-player), plus grade and earned/to-do filters and text search.
- **Spoiler setting**: hides the names and descriptions of hidden story trophies until they are earned.
- **Fully offline**: static files under `app/`, no build step, no network request at run time. No Rockstar logo, official artwork or game screenshot is used; the look is our own.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. To check the entry the way the grader sees it:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` into `out/` and writes `out/dossier.json`.

## Files

- `app/index.html` — the guide page: platinum progress, roadmap, missable warning, controls, checklist and guide panel.
- `app/app.js` — the tracker: loads `app/data/trophies.json`, renders the list and roadmap, saves progress, handles filters, search, spoilers, export and import.
- `app/style.css` — the guide's own look.
- `app/data/trophies.json` — the 55 trophies with official names, descriptions, grades, hidden flags, counts, roadmap stages, guides and sources.
- `main.ts` — hands the entry in: copies `app/` and `screenshots/` to `/output` and writes `dossier.json`.
- `screenshots/` — 3 screenshots of the app running (cover first by name).
- `serve.ts` — a tiny static server for local development.

## Sources

Trophy names, descriptions and grades: Exophase and PSNProfiles. Guide facts: PowerPyx (GTA 6 Trophy Guide & Roadmap), GTABase, and Output Lag's GTA 6 trophy list. Each trophy's entry in `app/data/trophies.json` names the sources its guide draws on.

---

Entered on [make.fun](https://make.fun/?ref=reispian&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards. See the bounty: https://make.fun/bounty/gta6-trophy-guide-01
