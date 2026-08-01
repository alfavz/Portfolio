// ── DARK / LIGHT MODE ──────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const sunIcon     = document.getElementById('sun-icon');
const moonIcon    = document.getElementById('moon-icon');

function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  sunIcon.classList.toggle('hidden', !dark);
  moonIcon.classList.toggle('hidden', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

const saved = localStorage.getItem('theme');
setTheme(saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches));
themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));

// ── LIVE CLOCK (GMT+7) ─────────────────────────────
function updateClock() {
  const now = new Date();
  const gmt7 = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  const h = String(gmt7.getUTCHours()).padStart(2, '0');
  const m = String(gmt7.getUTCMinutes()).padStart(2, '0');
  const s = String(gmt7.getUTCSeconds()).padStart(2, '0');
  const el = document.getElementById('clock-display');
  if (el) el.textContent = `${h}:${m}:${s} GMT+7`;
}
updateClock();
setInterval(updateClock, 1000);

// ── SCROLL REVEAL ──────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); } });
}, { threshold: 0.08 }).observe
  ? new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
    }, { threshold: 0.08 }).observe(document.documentElement)
  : null;

// Simple fallback
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
}, { threshold: 0.08 });
revealEls.forEach(el => io.observe(el));

// ── COPY EMAIL BUTTON ──────────────────────────────
const copyEmailBtn = document.getElementById('copy-email-btn');
const emailBtnText = document.getElementById('email-btn-text');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    const email = copyEmailBtn.dataset.email;
    navigator.clipboard.writeText(email).then(() => {
      emailBtnText.textContent = 'Copied!';
      copyEmailBtn.style.background = '#22c55e';
      copyEmailBtn.style.borderColor = '#22c55e';
      copyEmailBtn.style.color = '#fff';
      setTimeout(() => {
        emailBtnText.textContent = 'Email';
        copyEmailBtn.style = '';
      }, 1800);
    });
  });
}

// ── INTERACTIVE TERMINAL CLI ───────────────────────
const terminalBody   = document.getElementById('terminal-body');
const termBtns       = document.querySelectorAll('.term-btn');

const cmdOutputs = {
  whoami: [
    '> alfavz',
    '> Role      : Prompt Engineer & Junior Developer',
    '> Location  : Indonesia, GMT+7',
    '> Status    : Open to collaboration',
  ],
  skills: [
    '> Languages : JavaScript, TypeScript, Golang, C++',
    '> AI/ML     : Prompt Engineering, LLM Optimization',
    '> Backend   : Node.js, Express, REST APIs',
    '> Bots      : WhatsApp Automation, Baileys',
    '> Database  : MongoDB, PostgreSQL, Firebase',
  ],
  contact: [
    '> Email  : alfarezavirz@gmail.com',
    '> GitHub : github.com/alfavz',
    '> IG     : instagram.com/alfavzz',
    '> WA     : wa.me/6285133801810',
  ],
  help: [
    '> Available commands:',
    '>   whoami   — who am I?',
    '>   skills   — list technical skills',
    '>   contact  — get contact info',
    '>   clear    — clear terminal',
  ],
};

function addLine(text, cls = '') {
  const d = document.createElement('div');
  d.className = `terminal-line ${cls}`;
  d.innerHTML = text;
  terminalBody.appendChild(d);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function runCmd(cmd) {
  addLine(`<span class="t-prefix">alfavz@dev</span>  ~  <span style="color:var(--color-text)">$ ${cmd}</span>`);

  if (cmd === 'clear') {
    setTimeout(() => { terminalBody.innerHTML = ''; }, 200);
    return;
  }

  const lines = cmdOutputs[cmd];
  if (lines) {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= lines.length) { clearInterval(interval); return; }
      addLine(`<span class="t-out">${lines[i]}</span>`);
      i++;
    }, 80);
  } else {
    addLine(`<span class="t-err">bash: ${cmd}: command not found — try 'help'</span>`);
  }
}

termBtns.forEach(btn => {
  btn.addEventListener('click', () => runCmd(btn.dataset.cmd));
});

// ── PERSONAL PILLS ─────────────────────────────────
const personalPills     = document.querySelectorAll('.personal-pill');
const personalDetailBox = document.getElementById('personal-detail-box');
const personalDetailTxt = document.getElementById('personal-detail-text');
const personalDetailAcc = document.getElementById('personal-detail-accent');

const personalInfoData = {
  age:      { text: `Born on November 9, 2009 — turning 17 this year. Still young, already building things that matter.`, symbol: '🎂' },
  location: { text: `Based in Indonesia. Always open for remote collaboration and global opportunities.`, symbol: '🇮🇩' },
  single:   { text: `Full dedication toward personal growth, technical mastery, and creative exploration.`, symbol: '💖' },
  cat:      { text: `Feline enthusiast. Their quiet presence provides warmth and focus during long dev sessions.`, symbol: '🐾' },
  introvert:{ text: `Energy comes from self-reflection and quiet environments. Deep focus is my natural state.`, symbol: '🧘' },
  nolep:    { text: `Full-time dedication in a controlled environment is the key to peak productivity and skill growth.`, symbol: '🏠' },
  coding:   { text: `Programming is a limitless creative medium. Always exploring new languages, systems, and architectures to ship elegant, efficient solutions.`, symbol: '💻' },
};

let activePill = null;
personalPills.forEach(pill => {
  const key = pill.dataset.key;
  pill.addEventListener('click', () => {
    if (activePill === key) {
      pill.classList.remove('active');
      personalDetailBox.classList.add('hidden');
      activePill = null;
    } else {
      personalPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      personalDetailTxt.textContent = personalInfoData[key].text;
      personalDetailAcc.textContent = personalInfoData[key].symbol;
      personalDetailBox.classList.remove('hidden');
      activePill = key;
    }
  });
});

// ── SKILL CHIPS ────────────────────────────────────
const skillData = {
  'Prompt Engineering': { icon: '🎯', desc: 'Crafting high-precision structured prompts — system prompts, zero-shot, few-shot — for optimal LLM outputs.' },
  'AI Interaction':    { icon: '🤖', desc: 'Designing seamless dialog flows and intelligent interaction models for AI-powered systems.' },
  'Node.js':           { icon: '🟢', desc: 'High-performance async backend services, REST APIs, and custom bot automation frameworks.' },
  'JavaScript':        { icon: '🟡', desc: 'Core language for web interactivity, DOM manipulation, and automation engine logic.' },
  'TypeScript':        { icon: '🔷', desc: 'Type-safe codebases and scalable application architecture with static typing.' },
  'Golang':            { icon: '🐹', desc: 'Ultra-fast microservices and backend systems leveraging goroutine concurrency.' },
  'C++':               { icon: '⚙️', desc: 'Low-level system programming and critical computation performance optimization.' },
  'React':             { icon: '⚛️', desc: 'Interactive component-driven UI development with modern React patterns.' },
  'Next.js':           { icon: '▲', desc: 'Fullstack React framework with SSR, SSG, and optimized core web vitals.' },
  'Express':           { icon: '🚂', desc: 'Minimalist Node.js web framework for routing, middleware, and RESTful API design.' },
  'MongoDB':           { icon: '🍃', desc: 'Flexible document-oriented NoSQL database for scalable data management.' },
  'PostgreSQL':        { icon: '🐘', desc: 'ACID-compliant relational database for data integrity at scale.' },
  'Firebase':          { icon: '🔥', desc: 'Real-time database, cloud functions, and authentication as a service.' },
  'Website Scraping':  { icon: '🕸️', desc: 'Automated structured data extraction using Cheerio, Puppeteer, and custom crawlers.' },
};

const skillsGrid       = document.getElementById('skills-grid');
const skillDetailBox   = document.getElementById('skill-detail-box');
const skillDetailTitle = document.getElementById('skill-detail-title');
const skillDetailIcon  = document.getElementById('skill-detail-icon');
const skillDetailDesc  = document.getElementById('skill-detail-desc');
const skillHint        = document.getElementById('skill-hint');

let activeSkill = null;

Object.keys(skillData).forEach(name => {
  const chip = document.createElement('div');
  chip.className = 'skill-chip';
  chip.textContent = name;
  chip.addEventListener('click', () => {
    if (activeSkill === name) {
      chip.classList.remove('active');
      skillDetailBox.classList.add('hidden');
      skillHint.classList.remove('hidden');
      activeSkill = null;
    } else {
      document.querySelectorAll('.skill-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      skillDetailTitle.textContent = name;
      skillDetailIcon.textContent  = skillData[name].icon;
      skillDetailDesc.textContent  = skillData[name].desc;
      skillDetailBox.classList.remove('hidden');
      skillHint.classList.add('hidden');
      activeSkill = name;
    }
  });
  skillsGrid.appendChild(chip);
});

// ── COLLABORATION METADATA FETCHER ─────────────────
async function loadGroupInfo(cardId) {
  const link  = document.getElementById(cardId);
  if (!link) return;
  const thumb = document.getElementById(cardId + '-thumb');
  const title = document.getElementById(cardId + '-title');
  const desc  = document.getElementById(cardId + '-desc');
  const waUrl = link.dataset.waUrl;

  try {
    const res  = await fetch('/api/group-info?url=' + encodeURIComponent(waUrl));
    const json = await res.json();
    if (!json.status) throw new Error(json.message);

    const { groupName, groupIcon, inviteType, community } = json.data;
    if (groupName) {
      title.innerHTML = groupName + (inviteType === 'PARENT'
        ? ' <span class="verified" title="Verified Community">✓</span>' : '');
    }
    if (groupIcon) thumb.innerHTML = `<img src="${groupIcon}" alt="icon">`;

    desc.classList.remove('loading');
    desc.textContent = (community && community !== groupName)
      ? `Part of ${community}. Powered by Bot Xelira.`
      : 'Parent community housing active groups, powered by Bot Xelira.';
  } catch {
    desc.classList.remove('loading');
    desc.textContent = 'Parent community housing active groups, powered by Bot Xelira.';
  }
}

loadGroupInfo('collab-fxa');
