# 🌐 alfavz — Portfolio

Personal portfolio website built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

- **Hero Bento Layout** — Avatar + info card split layout
- **Live Clock** — Real-time GMT+7 clock in the header
- **Dark / Light Mode** — Toggle with preference saved to localStorage
- **Interactive Terminal CLI** — Simulated bash terminal with commands (`whoami`, `skills`, `contact`, `clear`)
- **Personal Info Pills** — Expandable info cards (age, location, status, etc.)
- **Skill Chips** — Clickable tech stack with descriptions
- **Copy Email Button** — One-click copy with visual feedback
- **Collaboration Section** — WhatsApp group metadata via API
- **File Protection** — Direct access to `.js` and `.css` files is blocked (403)

## 🗂️ Structure

```
rafel-portfolio/
├── index.html        # Main page structure
├── style.css         # Cyber Blue theme & layout
├── script.js         # All logic (clock, terminal, pills, skills)
├── avatar.jpg        # Profile picture
└── api/
    └── group-info.js # WhatsApp group metadata scraper
```

## 🚀 Running Locally

Server is unified at `/root/baileys/server.mjs` — serves both portfolio and music player.

```bash
node /root/baileys/server.mjs
```

Then open:
- **Portfolio** → `http://localhost:3000/`
- **Music Player** → `http://localhost:3000/music-player/`

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Structure | HTML5 |
| Styling | Vanilla CSS (CSS Variables) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Plus Jakarta Sans + JetBrains Mono |
| Icons | Inline SVG |
| Server | Node.js (http module) |

## 📬 Contact

- **Email** — alfarezavirz@gmail.com
- **GitHub** — [github.com/alfavz](https://github.com/alfavz)
- **Instagram** — [@alfavzz](https://instagram.com/alfavzz)
- **WhatsApp** — [wa.me/6285133801810](https://wa.me/6285133801810)

---

> Built with passion & late nights — alfavz © 2026
