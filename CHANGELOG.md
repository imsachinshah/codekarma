# Changelog

All notable changes to the **CodeKarma** extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2026-05-07

### Fixed

- **Sound plays when extension is disabled** — Sound effects continued playing after toggling the extension off due to a race condition and a missing guard in `SoundPlayer`. The `play()` method now checks `codekarma.enabled` before playing, and the command listener re-checks the enabled state after its async operation to prevent sounds firing mid-flight.

---

## [0.0.2] - 2026-05-07

### Fixed

- **Extension not disabling properly** — Status bar and roast notifications continued showing even after disabling the extension. The extension now fully hides the status bar and stops processing terminal events when disabled.

### Added

- **Enable/Disable toggle** — New `codekarma.enabled` setting and `CodeKarma: Enable/Disable` command let you pause CodeKarma without uninstalling. Toggling via Settings UI also takes effect immediately.
- **Demo GIF** — README now includes a live demo of the extension in action.

---

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
