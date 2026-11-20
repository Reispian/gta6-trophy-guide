// Leonida Platinum Guide — tracker for the 55 GTA 6 trophies.
// Progress lives in localStorage, so it survives a reload; export/import move it as a file.
// The app loads one local file, app/data/trophies.json, and makes no network request at all.
const KEY = 'leonida-platinum-guide-v1';
const SPOILER_KEY = 'leonida-platinum-guide-spoilers';
const DATA_URL = 'data/trophies.json';

const listEl = document.getElementById('trophyList');
const detailEl = document.getElementById('detail');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('gradeFilter');
const spoilerEl = document.getElementById('spoilerToggle');
const earnedOnlyEl = document.getElementById('earnedOnly');
const todoOnlyEl = document.getElementById('todoOnly');
const countEl = document.getElementById('resultCount');

// Roadmap stages, built from the official descriptions: story first, then the
// side characters, robberies, activities, collectibles, and the 100% cleanup.
const STAGES = [
  { n: 1, title: 'Play the story', text: 'Chapters 1–4 and the final mission. Do Lucia\u2019s balcony meditation in Chapter 1 — the only missable trophy.' },
  { n: 2, title: 'Side characters & strangers', text: 'Finish the final missions for Andy, Kenton, Billy, Randy and Tyrone, Bret\u2019s hunt, and 8 stranger strands.' },
  { n: 3, title: 'Robberies & partner jobs', text: 'Bank vaults, jewelry, armored trucks, gang operations and marked bills — most need your partner beside you.' },
  { n: 4, title: 'Activities & races', text: 'Shooting range golds, drone races, 20 race wins, fishing, arcade, bowling and 250 stunts.' },
  { n: 5, title: 'Collectibles & exploration', text: 'Card sets, WAiNK scans, 100 vehicles, all 52 areas of Leonida, garages and the Scooter Bros app.' },
  { n: 6, title: 'Cleanup & 100%', text: 'Challenges, Criminal Profile actions and the 100% checklist for A Long Road — then the platinum pops.' },
];
const STAGE_TROPHIES = {
  1: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 28],
  2: [22, 23, 24, 25, 26, 27, 29],
  3: [33, 34, 36, 39, 40, 41, 43, 52],
  4: [15, 16, 17, 18, 19, 20, 21, 32, 46, 47, 51],
  5: [30, 31, 35, 37, 38, 42, 44, 45, 50, 54, 55],
  6: [1, 14, 48, 49, 53],
};

let trophies = [];
let earned = new Set(loadStored(KEY));
let hideSpoilers = loadStored(SPOILER_KEY) === '1';
let kindFilter = 'all';
let selectedName = null;

spoilerEl.checked = hideSpoilers;

function loadStored(key) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null'); } catch { return null; }
}
function saveEarned() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}
function saveSpoilers() {
  localStorage.setItem(SPOILER_KEY, hideSpoilers ? '1' : '0');
}
function isStorySpoiler(t) {
  return t.hidden && t.kind === 'story';
}
function shownName(t) {
  if (hideSpoilers && isStorySpoiler(t) && !earned.has(t.name)) return 'Hidden story trophy';
  return t.name;
}
function shownDesc(t) {
  if (hideSpoilers && isStorySpoiler(t) && !earned.has(t.name)) return 'Hidden until earned — turn spoilers off to reveal it.';
  return t.description;
}

function gradePill(t) {
  const s = document.createElement('span');
  s.className = 'grade-pill grade-' + t.grade;
  s.textContent = t.grade;
  return s;
}
function tag(text, cls) {
  const s = document.createElement('span');
  s.className = 'tag ' + cls;
  s.textContent = text;
  return s;
}

function matchesFilters(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.guide || '').toLowerCase().includes(q))) return false;
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (kindFilter === 'story' && t.kind !== 'story') return false;
  if (kindFilter === 'missable' && !t.missable) return false;
  if (kindFilter === 'collectibles' && t.kind !== 'collectibles') return false;
  if (kindFilter === 'activities' && t.kind !== 'activities') return false;
  if (kindFilter === 'online') return false; // No online trophies: the list is all single-player.
  if (earnedOnlyEl.checked && !earned.has(t.name)) return false;
  if (todoOnlyEl.checked && earned.has(t.name)) return false;
  return true;
}

function renderRoadmap() {
  const stagesEl = document.getElementById('stages');
  stagesEl.replaceChildren();
  for (const stage of STAGES) {
    const ids = STAGE_TROPHIES[stage.n] || [];
    const done = ids.filter((id) => earned.has(trophies[id - 1].name)).length;
    const li = document.createElement('li');
    if (done === ids.length) li.className = 'done';
    const num = document.createElement('div');
    num.className = 'stage-num';
    num.textContent = 'Stage ' + stage.n;
    const h = document.createElement('h3');
    h.textContent = stage.title;
    const p = document.createElement('p');
    p.textContent = stage.text;
    const c = document.createElement('div');
    c.className = 'stage-count';
    c.textContent = done + ' of ' + ids.length + ' trophies';
    li.append(num, h, p, c);
    stagesEl.append(li);
  }
}

function renderProgress() {
  const total = trophies.length || 55;
  const pct = Math.round((earned.size / total) * 100);
  document.getElementById('progressText').textContent = earned.size + ' of ' + total + ' earned';
  document.getElementById('platinumPct').textContent = pct + '%';
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('platinumRing').style.setProperty('--pct', String(pct));
}

function renderList() {
  const visible = trophies.filter(matchesFilters);
  listEl.replaceChildren();
  if (!visible.length) {
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.textContent = kindFilter === 'online'
      ? 'No online trophies — all 55 are single-player and offline. Nothing to filter here.'
      : 'No trophies match these filters. Clear the search or pick another filter.';
    listEl.append(div);
  }
  for (const t of visible) {
    const li = document.createElement('li');
    if (earned.has(t.name)) li.className = 'earned';
    if (selectedName === t.name) li.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name); else earned.delete(t.name);
      saveEarned();
      renderAll();
    });
    const body = document.createElement('div');
    body.className = 'trophy-body';
    const name = document.createElement('div');
    name.className = 'trophy-name' + (hideSpoilers && isStorySpoiler(t) && !earned.has(t.name) ? ' spoiler-name' : '');
    name.textContent = shownName(t);
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = shownDesc(t);
    body.append(name, desc);
    if (t.hidden) body.append(tag('Hidden', 'tag-hidden'));
    if (t.missable) body.append(tag('Missable', 'tag-missable'));
    if (t.count) body.append(tag('x' + t.count, 'tag-count'));
    body.append(tag(t.kind, 'tag-kind'));
    li.append(box, body, gradePill(t));
    li.addEventListener('click', () => { selectedName = t.name; renderAll(); });
    listEl.append(li);
  }
  countEl.textContent = visible.length + ' of ' + trophies.length + ' trophies shown · ' + earned.size + ' earned · ' + (trophies.length - earned.size) + ' to go';
}

function sourceLink(text) {
  const m = text.match(/^(.*?)\s*\((https?:\/\/[^)]+)\)$/);
  const li = document.createElement('li');
  if (m) {
    li.append(document.createTextNode(m[1] + ' — '));
    const a = document.createElement('a');
    a.href = m[2];
    a.textContent = m[2];
    a.target = '_blank';
    a.rel = 'noopener';
    li.append(a);
  } else {
    li.textContent = text;
  }
  return li;
}

function renderDetail() {
  const t = trophies.find((x) => x.name === selectedName);
  detailEl.replaceChildren();
  if (!t) {
    const p = document.createElement('p');
    p.className = 'detail-empty';
    p.textContent = 'Pick a trophy on the left to read its guide and sources.';
    detailEl.append(p);
    return;
  }
  const h = document.createElement('h3');
  h.textContent = shownName(t);
  const pills = document.createElement('p');
  pills.append(gradePill(t));
  if (t.hidden) pills.append(tag('Hidden', 'tag-hidden'));
  if (t.missable) pills.append(tag('Missable', 'tag-missable'));
  if (t.count) pills.append(tag('Count: ' + t.count, 'tag-count'));
  const d = document.createElement('p');
  d.className = 'detail-desc';
  d.textContent = shownDesc(t);
  const gh = document.createElement('h4');
  gh.textContent = 'Guide';
  const g = document.createElement('p');
  g.className = 'guide-text';
  g.textContent = t.guide;
  const sh = document.createElement('h4');
  sh.textContent = 'Sources for this guide';
  const ul = document.createElement('ul');
  for (const s of t.sources || []) ul.append(sourceLink(s));
  const rh = document.createElement('h4');
  rh.textContent = 'Roadmap';
  const rp = document.createElement('p');
  rp.textContent = 'Stage ' + t.roadmap + ' of 6 — ' + (STAGES[t.roadmap - 1] ? STAGES[t.roadmap - 1].title : '');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'earned-btn' + (earned.has(t.name) ? ' earned' : '');
  btn.textContent = earned.has(t.name) ? '✓ Earned — mark as not earned' : 'Mark as earned';
  btn.addEventListener('click', () => {
    if (earned.has(t.name)) earned.delete(t.name); else earned.add(t.name);
    saveEarned();
    renderAll();
  });
  detailEl.append(h, pills, d, gh, g, sh, ul, rh, rp, btn);
}

function renderAll() {
  renderProgress();
  renderRoadmap();
  renderList();
  renderDetail();
}

function download(filename, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

document.getElementById('kindFilters').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-kind]');
  if (!btn) return;
  kindFilter = btn.dataset.kind;
  for (const b of document.querySelectorAll('#kindFilters button')) b.classList.toggle('active', b === btn);
  renderList();
});
searchEl.addEventListener('input', renderList);
gradeEl.addEventListener('change', renderList);
earnedOnlyEl.addEventListener('change', renderList);
todoOnlyEl.addEventListener('change', renderList);
spoilerEl.addEventListener('change', () => {
  hideSpoilers = spoilerEl.checked;
  saveSpoilers();
  renderAll();
});
document.getElementById('exportBtn').addEventListener('click', () => {
  download('leonida-platinum-progress.json', JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2));
});
document.getElementById('importInput').addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set(names.filter((n) => known.has(n)));
    saveEarned();
    renderAll();
  } catch {
    countEl.textContent = 'That file could not be imported — it is not a progress file from this guide.';
  }
  e.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!earned.size) return;
  if (window.confirm('Clear all earned trophies?')) {
    earned = new Set();
    saveEarned();
    renderAll();
  }
});

const data = await (await fetch(DATA_URL)).json();
trophies = data.trophies;
selectedName = trophies.find((t) => t.missable)?.name ?? trophies[0].name;
renderAll();
