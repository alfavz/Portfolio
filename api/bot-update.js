import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const BASE        = '/root/baileys/rafel-portfolio';
const PORTFOLIO   = path.join(BASE, 'index.html');
const SCRIPT      = path.join(BASE, 'script.js');
const AVATAR      = path.join(BASE, 'avatar.jpg');

// ── BOT API KEY — ganti dengan key milikmu ──────────
export const BOT_API_KEY = process.env.BOT_API_KEY || 'alfavz-tixo-secret-2026';

// ── GITHUB CONFIG ───────────────────────────────────
const GH_REPO   = process.env.GH_REPO   || 'alfavz/portfolio';   // username/repo
const GH_BRANCH = process.env.GH_BRANCH || 'main';

function gitPush(message) {
  try {
    execSync(`cd ${BASE} && git add -A && git commit -m "${message}" && git push origin ${GH_BRANCH}`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    console.error('[bot-api] git push failed:', e.message);
    return false;
  }
}

// ── HELPERS ─────────────────────────────────────────
function replaceInFile(filePath, pattern, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(pattern, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
}

// ── HANDLERS ────────────────────────────────────────

/**
 * UPDATE PROFILE
 * Body: { name, role, tagline, age, email, github, whatsapp, instagram }
 */
export function handleUpdateProfile(body) {
  const changes = [];

  if (body.name) {
    replaceInFile(PORTFOLIO, /<h1>.*?<\/h1>/, `<h1>${body.name}</h1>`);
    replaceInFile(PORTFOLIO, /alt=".*?"/, `alt="${body.name}"`);
    changes.push('name');
  }

  if (body.role) {
    replaceInFile(PORTFOLIO,
      /(<p class="role-subtitle">).*?(<\/p>)/,
      `$1${body.role}$2`
    );
    replaceInFile(SCRIPT,
      /'> Role\s+:.*?',/,
      `'> Role      : ${body.role}',`
    );
    changes.push('role');
  }

  if (body.tagline) {
    replaceInFile(PORTFOLIO,
      /(<p class="tagline">).*?(<\/p>)/,
      `$1${body.tagline}$2`
    );
    changes.push('tagline');
  }

  if (body.age) {
    replaceInFile(PORTFOLIO,
      /\d+ Years(\s*<\/button>)/,
      `${body.age} Years$1`
    );
    changes.push('age');
  }

  if (body.email) {
    replaceInFile(PORTFOLIO,
      /data-email=".*?"/,
      `data-email="${body.email}"`
    );
    replaceInFile(SCRIPT,
      /'> Email\s+:.*?',/,
      `'> Email  : ${body.email}',`
    );
    changes.push('email');
  }

  if (body.github) {
    replaceInFile(PORTFOLIO,
      /href="https:\/\/github\.com\/[^"]*"/,
      `href="https://github.com/${body.github}"`
    );
    replaceInFile(SCRIPT,
      /'> GitHub\s*:.*?',/,
      `'> GitHub : github.com/${body.github}',`
    );
    changes.push('github');
  }

  if (body.whatsapp) {
    replaceInFile(PORTFOLIO,
      /href="https:\/\/wa\.me\/[^"]*"/,
      `href="https://wa.me/${body.whatsapp}"`
    );
    replaceInFile(SCRIPT,
      /'> WA\s+:.*?',/,
      `'> WA     : wa.me/${body.whatsapp}',`
    );
    changes.push('whatsapp');
  }

  if (body.instagram) {
    replaceInFile(PORTFOLIO,
      /href="https:\/\/instagram\.com\/[^"]*"/,
      `href="https://instagram.com/${body.instagram}"`
    );
    replaceInFile(SCRIPT,
      /'> IG\s+:.*?',/,
      `'> IG     : instagram.com/${body.instagram}',`
    );
    changes.push('instagram');
  }

  return changes;
}

/**
 * UPDATE COLLABORATION
 * Body: { groupUrl, title, description }
 */
export function handleUpdateCollab(body) {
  const changes = [];

  if (body.groupUrl) {
    replaceInFile(PORTFOLIO,
      /data-wa-url=".*?"/,
      `data-wa-url="${body.groupUrl}"`
    );
    replaceInFile(PORTFOLIO,
      /(id="collab-fxa"[\s\S]*?href=").*?(")/,
      `$1${body.groupUrl}$2`
    );
    changes.push('groupUrl');
  }

  if (body.title) {
    replaceInFile(PORTFOLIO,
      /(<div class="collab-title" id="collab-fxa-title">).*?(<\/div>)/,
      `$1${body.title}$2`
    );
    changes.push('title');
  }

  if (body.description) {
    replaceInFile(PORTFOLIO,
      /(<div class="collab-desc" id="collab-fxa-desc">).*?(<\/div>)/,
      `$1${body.description}$2`
    );
    changes.push('description');
  }

  return changes;
}

/**
 * UPDATE AVATAR
 * Body: { imageBase64 } — base64 encoded jpg/png
 */
export function handleUpdateAvatar(body) {
  if (!body.imageBase64) return [];
  const buffer = Buffer.from(body.imageBase64, 'base64');
  fs.writeFileSync(AVATAR, buffer);
  return ['avatar'];
}

/**
 * MAIN HANDLER — dipanggil dari server.mjs
 */
export async function botApiHandler(req, res, rawBody) {
  // Auth check
  const authKey = req.headers['x-bot-key'] || req.headers['authorization']?.replace('Bearer ', '');
  if (authKey !== BOT_API_KEY) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Unauthorized' }));
    return;
  }

  let body;
  try {
    body = JSON.parse(rawBody || '{}');
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
    return;
  }

  const action  = body.action || '';
  let changes   = [];
  let message   = '';

  try {
    if (action === 'update-profile') {
      changes = handleUpdateProfile(body);
      message = `bot: update profile [${changes.join(', ')}]`;
    } else if (action === 'update-collab') {
      changes = handleUpdateCollab(body);
      message = `bot: update collaboration [${changes.join(', ')}]`;
    } else if (action === 'update-avatar') {
      changes = handleUpdateAvatar(body);
      message = `bot: update avatar`;
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Unknown action. Use: update-profile | update-collab | update-avatar' }));
      return;
    }

    // Push to GitHub
    const pushed = gitPush(message);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      action,
      changes,
      pushed,
      message: pushed ? 'Updated & pushed to GitHub ✅' : 'Updated locally (git push failed) ⚠️'
    }));

  } catch (err) {
    console.error('[bot-api] error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: err.message }));
  }
}
