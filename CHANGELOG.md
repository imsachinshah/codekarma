# Changelog

All notable changes to the **CodeKarma** extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-03-11

### Added

- **Terminal Karma Tracking** — Monitors terminal command outcomes and maintains a karma score that rises on success and drops on failure.
- **Gamified Rank System** — Earn ranks as your karma grows; break streaks and watch your rank change.
- **AI Roasts on Errors** — Get roasted with witty messages when your terminal commands fail. Supports four roast levels: mild, medium, savage, and desi.
- **AI-Powered Dynamic Roasts** — Optional integration with OpenAI or Anthropic APIs for context-aware, dynamically generated roasts.
- **Sound Effects** — Plays sound effects (faaah, oof, bruh, vine_boom, windows_error) on terminal errors, with configurable volume.
- **Shareable Badge Cards** — Generate shareable badge card images showcasing your karma stats for social media.
- **Interactive Dashboard** — Open a dedicated CodeKarma dashboard to view your stats, streaks, and rank at a glance.
- **Daily Damage Report** — Receive a daily summary notification of your terminal karma performance.
- **Configurable Settings** — Full control over roast level, sound effects, sound volume, AI provider, badge username, and daily reports through VS Code settings.
- **Commands**:
  - `CodeKarma: Open Dashboard` — View your karma dashboard.
  - `CodeKarma: Generate Shareable Badge` — Create a badge card image.
  - `CodeKarma: Reset Karma` — Reset your karma score to zero.
  - `CodeKarma: Toggle Sound Effects` — Enable or disable error sounds.
  - `CodeKarma: Set Roast Level` — Choose your preferred roast intensity.
  - `CodeKarma: Show Daily Damage Report` — Display today's damage report.
