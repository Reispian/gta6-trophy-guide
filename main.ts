// Leonida Platinum Guide — a make.fun gta6-trophy-guide-01 entry (Node 22, standard library only).
// The guide itself is plain static files under app/: index.html opens in a browser, app.js is the
// tracker (checklist saved in localStorage, export/import, filters, spoiler setting), style.css is
// its own look, and app/data/trophies.json holds the 55 official trophies with a guide and sources
// for each. Nothing in app/ is built, and nothing it loads comes over the network — every file it
// needs sits under app/, so it works with the network off.
//
// This program hands the guide in: it copies app/ and screenshots/ from beside this file into
// /output and writes /output/dossier.json, the summary the judge reads (the screenshots, the
// first load's files and bytes, and the source), using the vendored make.fun library.
// vendor/makefun-frontend.ts must stay exactly as the kit shipped it: the scorer rebuilds the
// dossier with its own copy and requires the two to match byte for byte.
//
// Serve the guide locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps (from the kit's reference/gate.json): only text_max_bytes shapes the
// bytes; the other limits refuse an entry the scorer would refuse anyway — more than 4 screenshots
// or one over 256 KiB, more than 993 files and directories in app/, or more than 48 MiB of app
// files. app/ counts beside /output's own 1000-entry cap, together with screenshots/ and dossier.json.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
