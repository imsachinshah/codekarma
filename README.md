<p align="center">
  <img src="media/icons/codekarma.png" alt="CodeKarma Logo" width="200"/>
</p>

<h1 align="center">🔥 CodeKarma — Your Terminal Judges You</h1>

<p align="center">
  <strong>Gamified terminal error tracking + AI-powered roasts that hit different.</strong><br/>
  Every command you run earns karma. Every failure gets punished — with style.
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=imsachinshah.codekarma">
    <img src="https://img.shields.io/visual-studio-marketplace/v/imsachinshah.codekarma?label=VS%20Code%20Marketplace&color=blue" alt="VS Code Marketplace"/>
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=imsachinshah.codekarma">
    <img src="https://img.shields.io/visual-studio-marketplace/i/imsachinshah.codekarma?color=green" alt="Installs"/>
  </a>
  <img src="https://img.shields.io/badge/roasts-120%2B-red" alt="Roasts"/>
  <img src="https://img.shields.io/badge/license-MIT-yellow" alt="License"/>
  <img src="https://img.shields.io/badge/vibe-immaculate-blueviolet" alt="Vibe"/>
</p>

<p align="center">
  <em>Install the extension and press F5 to see it in action!</em>
</p>

---

## 💀 What Is CodeKarma?

You know that mass of red text in your terminal? The segfault you've seen 47 times today? The `npm install` that exploded for no reason?

**CodeKarma sees all of it.**

It tracks every command you run in VS Code's integrated terminal, assigns you a **karma score**, gives you a **rank**, and — most importantly — **roasts you when you fail.**

Think of it as a fitness tracker, but for your terminal. Except instead of congratulating you, it emotionally damages you.

> *"You mass `git push --force` on main and expect me to be nice? Beta, ghar jaake coding seekh pehle."*
>
> — CodeKarma (Desi Mode 🇮🇳)

---

## 🎮 Features

### 📊 Karma Score System

Every terminal command is tracked. Every. Single. One.

| Event | Karma |
|---|---|
| ✅ Successful command | **+5** |
| ❌ Failed command | **-10** |
| 🔥 Streak bonus (5+) | **+2 per streak level** |
| 🏆 Milestone hit | **Bonus karma + celebration** |

Your karma score lives in the **status bar** — always watching, always judging.

*Status bar: `🔥 420 | ⚡ 12 | Senior`*

---

### 🪜 7 Ranks — Climb or Cry

Your rank is tied to your karma score. Mess up enough and you're back to square one.

| Rank | Karma Required | Vibe |
|---|---|---|
| 🧑‍💻 Intern | 0 | "What does `cd` do?" |
| 👶 Junior | 100 | Stack Overflow copy-paste warrior |
| 💼 Mid | 300 | Writes code. Sometimes it works. |
| 🧠 Senior | 600 | Debugs with `console.log` (but faster) |
| 🏗️ Staff | 1000 | Architects stuff nobody understands |
| ⚡ 10x Dev | 2000 | Types at the speed of thought |
| 🌌 God Mode | 5000 | The terminal bends to your will |

> Hitting **God Mode** means your terminal literally fears you. Respect.

---

### 🔥 Streak System

Consecutive successful commands build your streak. The higher the streak, the more bonus karma you earn.

**Milestone celebrations** trigger at:

🎉 **5** → 🔥 **10** → 💪 **25** → 🏆 **50** → 👑 **100**

Break your streak? The roast hits **twice as hard**.

---

### 😈 120+ Built-In Roasts (4 Levels of Pain)

Set your roast level based on how much emotional damage you can handle.

#### ☁️ Mild — Safe for Work

> *"Hmm, that didn't work. But hey, at least you tried!"*
>
> *"Error? Don't worry, even the best developers Google things."*
>
> *"That command failed, but your spirit is unbreakable."*

#### 🌶️ Medium — A Little Spicy

> *"Another error? Your keyboard is filing for emotional damages."*
>
> *"Your terminal just sighed. Out loud."*
>
> *"If debugging was a sport, you'd be warming the bench."*

#### 💀 Savage — No Mercy

> *"At this point, your IDE is your emotional support animal."*
>
> *"Your code doesn't have bugs. It IS the bug."*
>
> *"Even Stack Overflow can't save you from yourself."*

#### 🇮🇳 Desi — Indian Uncle Energy (Hinglish)

> *"Beta, yeh kya kar rahe ho? Sharma ji ka beta toh Google mein hai."*
>
> *"Itne errors? IIT ki taiyaari chhod di thi isliye?"*
>
> *"Tera code dekh ke mujhe BP high ho gaya. Doctor ka bill tu bharega."*
>
> *"Arre bhai, `node_modules` delete karke try kar. Kuch nahi toh zindagi mein naya start milega."*

---

### 🤖 AI-Powered Roasts (Optional)

Plug in your **OpenAI** or **Anthropic** API key and get **context-aware roasts** based on the exact command that failed.

Regular roast:
> *"Another error? Classic."*

AI roast after you run `docker build` and it fails:
> *"You're trying to containerize your problems, but even Docker can't contain this mess. Maybe try `docker run --rm your-career`?"*

AI roast after a failed `git rebase`:
> *"You tried to rewrite history and history fought back. The merge conflicts are the universe telling you to `git gud`."*

**The AI reads your actual error. The roast is personal. You've been warned.**

---

### 🔊 Sound Effects

Because visual roasts aren't enough — you need to **hear** your failure.

| Sound | Vibe |
|---|---|
| 💨 `faaah` | That deep sigh of disappointment |
| 😤 `oof` | Physical pain, digitized |
| 😑 `bruh` | When even the terminal is done with you |
| 💥 `vine_boom` | Dramatic. Cinematic. Devastating. |
| 🪟 `windows_error` | Nostalgia meets trauma |

> Your coworkers WILL hear it. That's a feature, not a bug.

---

### 📈 Dashboard

A full webview panel with everything you need to track your descent into madness — or your climb to glory.

- 📊 **7-day karma chart** — See exactly where you started losing it
- 🏆 **Rank ladder** — Visual progress toward your next rank
- 📉 **Success rate** — The number you're afraid to look at
- 🔥 **Current streak** — Your bragging rights (or lack thereof)
- 📋 **Recent commands** — A timeline of your crimes

*Run `CodeKarma: Open Dashboard` to see your full stats*

> **Open it:** `Ctrl+Shift+P` → `CodeKarma: Open Dashboard`

---

### 🎴 Shareable SVG Badge Card

Auto-generated card with your **karma score, rank, streak, and success rate** — styled, polished, and ready to flex.

*Auto-generated SVG card with your stats — copy and share!*

- 🎨 Dynamically styled based on your current rank
- 📋 **Copy to clipboard** with one click
- 🐦 Share on **Twitter/X** or **LinkedIn** to assert dominance (or cry for help)

> *"Just hit 10x Dev rank on CodeKarma. My terminal fears me. 🔥"*
>
> `Ctrl+Shift+P` → `CodeKarma: Generate Shareable Badge`

---

### 📬 Daily Damage Report

End-of-day notification summarizing the carnage:

- Total commands run
- Success/failure ratio
- Karma gained or lost
- Current rank and streak
- The roast you deserved most

> Like a performance review, but from your terminal. And it's brutally honest.

---

## 🚀 Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for **"CodeKarma"**
4. Click **Install**
5. Suffer (affectionately)

### From VSIX

```bash
code --install-extension codekarma-0.0.1.vsix
```

### Requirements

- **VS Code 1.93+**
- **Shell integration must be enabled** — CodeKarma uses VS Code's shell integration API to track terminal commands

  Make sure this is in your `settings.json`:
  ```json
  {
    "terminal.integrated.shellIntegration.enabled": true
  }
  ```

---

## ⚙️ Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `codekarma.roastLevel` | `string` | `mild` | Roast intensity: `mild`, `medium`, `savage`, `desi` |
| `codekarma.soundEnabled` | `boolean` | `true` | Enable/disable sound effects on failures |
| `codekarma.soundEffect` | `string` | `bruh` | Sound: `faaah`, `oof`, `bruh`, `vine_boom`, `windows_error` |
| `codekarma.soundVolume` | `number` | `0.5` | Volume level (0 to 1) |
| `codekarma.useAiRoasts` | `boolean` | `false` | Enable AI-generated roasts |
| `codekarma.aiProvider` | `string` | `openai` | AI provider: `openai` or `anthropic` |
| `codekarma.aiApiKey` | `string` | `""` | Your API key for AI roasts |
| `codekarma.dailyReport` | `boolean` | `true` | Show daily damage report notification |
| `codekarma.badgeUsername` | `string` | `""` | Username displayed on your badge card |

---

## 🎯 Commands

Open the Command Palette (`Ctrl+Shift+P`) and type `CodeKarma`:

| Command | What It Does |
|---|---|
| `CodeKarma: Open Dashboard` | Opens the full stats dashboard |
| `CodeKarma: Generate Shareable Badge` | Creates your SVG badge card |
| `CodeKarma: Reset Karma` | Wipes your score (no shame... okay, some shame) |
| `CodeKarma: Toggle Sound Effects` | Turns sounds on/off |
| `CodeKarma: Set Roast Level` | Pick your pain threshold |
| `CodeKarma: Show Daily Damage Report` | See today's summary |

---

## 🤔 Why CodeKarma?

Because coding is already painful. Might as well make it **entertaining**.

- 🎮 **Gamification actually works** — You'll write better commands just to protect your streak
- 😂 **The roasts are therapeutic** — Laughing at your own failures is a coping mechanism (a healthy one)
- 📊 **Data doesn't lie** — That 43% success rate? Yeah, you needed to see that
- 🏆 **Competition drives improvement** — Share your badge. Flex your rank. Get roasted by friends
- 🇮🇳 **Desi mode exists** — Because nothing hits harder than an Indian uncle telling you Sharma ji's son works at Google

> **CodeKarma doesn't make you a better developer.**
> **It makes you a developer who's aware of how many times they fail.**
> **And honestly? That's more terrifying.**

---

## 📸 Screenshots

*Screenshots coming soon! Press `F5` in the extension folder to try it yourself.*

---

## 🤝 Contributing

CodeKarma is open source and contributions are welcome! Whether you want to add new roasts, build features, or fix bugs — we'd love your help.

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/codekarma.git
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run the extension** in development mode:
   - Press `F5` in VS Code to launch the Extension Development Host
5. **Make your changes** and test them
6. **Submit a Pull Request** with a clear description

### Ideas for Contributions

- 🌍 **New roast packs** — Add roasts in other languages (Spanish, French, Japanese, etc.)
- 🎵 **New sound effects** — The meme-ier, the better
- 📊 **Dashboard improvements** — Charts, animations, themes
- 🏅 **Achievement system** — Unlock badges for specific milestones
- 🔌 **Integration ideas** — Slack notifications, Discord webhooks, etc.

> **Got a roast so good it made a senior dev cry?** Open a PR. We want it.

---

## 📄 License

MIT — Use it, fork it, roast it. Just don't blame us for the emotional damage.

---

<p align="center">
  <strong>Built with 💔 and questionable life choices.</strong><br/><br/>
  If CodeKarma made you laugh, cry, or mass <code>git push --force</code> in anger —<br/>
  ⭐ <strong>Star the repo</strong> and share your badge on Twitter/X.<br/><br/>
  <em>Your terminal is watching. Always.</em>
</p>
