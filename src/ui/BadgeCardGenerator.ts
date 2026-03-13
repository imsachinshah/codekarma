import * as vscode from 'vscode';
import { execSync } from 'child_process';
import { KarmaStore } from '../karma/KarmaStore';
import { RankSystem } from '../karma/RankSystem';

export class BadgeCardGenerator {
  constructor(
    private store: KarmaStore,
    private rankSystem: RankSystem,
  ) {}

  async generate(): Promise<void> {
    const data = this.store.get();
    const rank = this.rankSystem.getRank(data.score);
    const nextRank = this.rankSystem.getNextRank(data.score);
    const progress = this.rankSystem.getProgressToNext(data.score);
    const username = this.getUsername();
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

    const successRate = data.totalCommands > 0
      ? Math.round((data.totalSuccesses / data.totalCommands) * 100)
      : 0;

    const svg = this.buildSvg({
      username,
      score: data.score,
      rank: rank.name,
      rankEmoji: rank.emoji,
      streak: data.longestStreak,
      totalCommands: data.totalCommands,
      successRate,
      nextRankName: nextRank?.name ?? 'MAX',
      progress,
      date: today,
    });

    await vscode.env.clipboard.writeText(svg);

    const choice = await vscode.window.showInformationMessage(
      `🎴 CodeKarma badge copied to clipboard as SVG! Paste it anywhere.`,
      'Open Preview',
    );

    if (choice === 'Open Preview') {
      const panel = vscode.window.createWebviewPanel(
        'codekarma.badge',
        'CodeKarma Badge',
        vscode.ViewColumn.One,
        {},
      );
      panel.webview.html = `<!DOCTYPE html><html><body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#0a0a1a;">${svg}</body></html>`;
    }
  }

  private getUsername(): string {
    const config = vscode.workspace.getConfiguration('codekarma');
    const custom = config.get<string>('badgeUsername', '');
    if (custom) return custom;

    try {
      return execSync('git config user.name', { encoding: 'utf-8' }).trim();
    } catch {
      try {
        return execSync('whoami', { encoding: 'utf-8' }).trim();
      } catch {
        return 'Developer';
      }
    }
  }

  private buildSvg(data: {
    username: string;
    score: number;
    rank: string;
    rankEmoji: string;
    streak: number;
    totalCommands: number;
    successRate: number;
    nextRankName: string;
    progress: number;
    date: string;
  }): string {
    const progressWidth = Math.max(0, Math.min(310, (data.progress / 100) * 310));
    const rateColor = data.successRate >= 70 ? '#22c55e' : data.successRate >= 40 ? '#f59e0b' : '#f43f5e';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="340" viewBox="0 0 480 340">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0a1a"/>
      <stop offset="40%" style="stop-color:#1a1040"/>
      <stop offset="100%" style="stop-color:#0d0d20"/>
    </linearGradient>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="100%" style="stop-color:#f43f5e"/>
    </linearGradient>
    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#c084fc"/>
      <stop offset="50%" style="stop-color:#f472b6"/>
      <stop offset="100%" style="stop-color:#fb923c"/>
    </linearGradient>
    <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(124,58,237,0.3)"/>
      <stop offset="100%" style="stop-color:rgba(244,63,94,0.15)"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softGlow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="480" height="340" rx="20" fill="url(#bg)"/>

  <!-- Ambient glow orbs -->
  <circle cx="80" cy="60" r="80" fill="rgba(124,58,237,0.06)"/>
  <circle cx="420" cy="280" r="100" fill="rgba(244,63,94,0.04)"/>

  <!-- Border -->
  <rect x="1" y="1" width="478" height="338" rx="19" fill="none" stroke="url(#cardBorder)" stroke-width="1"/>
  <!-- Top shine line -->
  <line x1="80" y1="1" x2="400" y2="1" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- Header -->
  <text x="28" y="32" font-family="'SF Mono','Fira Code',monospace" font-size="10" font-weight="600" letter-spacing="2" fill="#7c3aed">CODEKARMA</text>
  <text x="452" y="32" font-family="'SF Mono','Fira Code',monospace" font-size="9" fill="#475569" text-anchor="end">${data.date}</text>

  <!-- Divider -->
  <line x1="28" y1="44" x2="452" y2="44" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

  <!-- Username -->
  <text x="28" y="74" font-family="-apple-system,'Segoe UI',sans-serif" font-size="22" font-weight="700" fill="#f8fafc">${escapeXml(data.username)}</text>

  <!-- Rank Badge -->
  <rect x="28" y="84" width="${data.rank.length * 9 + 48}" height="26" rx="13" fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.3)" stroke-width="1"/>
  <text x="42" y="101" font-family="-apple-system,sans-serif" font-size="13" fill="#a78bfa" font-weight="600">${data.rankEmoji} ${data.rank}</text>

  <!-- Score (right-aligned, large) -->
  <text x="452" y="76" font-family="'SF Mono','Fira Code',monospace" font-size="38" font-weight="800" fill="url(#scoreGrad)" text-anchor="end" filter="url(#glow)">${data.score.toLocaleString()}</text>
  <text x="452" y="96" font-family="'SF Mono','Fira Code',monospace" font-size="10" fill="#64748b" text-anchor="end" letter-spacing="2">KARMA</text>

  <!-- Stats Row -->
  <rect x="28" y="124" width="130" height="64" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  <text x="93" y="148" font-family="'SF Mono','Fira Code',monospace" font-size="9" fill="#475569" text-anchor="middle" letter-spacing="1">BEST STREAK</text>
  <text x="93" y="174" font-family="'SF Mono','Fira Code',monospace" font-size="22" font-weight="700" fill="#22c55e" text-anchor="middle">${data.streak}</text>

  <rect x="170" y="124" width="140" height="64" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  <text x="240" y="148" font-family="'SF Mono','Fira Code',monospace" font-size="9" fill="#475569" text-anchor="middle" letter-spacing="1">COMMANDS</text>
  <text x="240" y="174" font-family="'SF Mono','Fira Code',monospace" font-size="22" font-weight="700" fill="#60a5fa" text-anchor="middle">${data.totalCommands.toLocaleString()}</text>

  <rect x="322" y="124" width="130" height="64" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  <text x="387" y="148" font-family="'SF Mono','Fira Code',monospace" font-size="9" fill="#475569" text-anchor="middle" letter-spacing="1">SUCCESS RATE</text>
  <text x="387" y="174" font-family="'SF Mono','Fira Code',monospace" font-size="22" font-weight="700" fill="${rateColor}" text-anchor="middle">${data.successRate}%</text>

  <!-- Progress Section -->
  <text x="28" y="218" font-family="'SF Mono','Fira Code',monospace" font-size="10" fill="#64748b">Progress to <tspan fill="#a78bfa" font-weight="600">${data.nextRankName}</tspan></text>
  <text x="452" y="218" font-family="'SF Mono','Fira Code',monospace" font-size="10" fill="#7c3aed" font-weight="600" text-anchor="end">${data.progress}%</text>

  <!-- Progress bar track -->
  <rect x="28" y="228" width="424" height="10" rx="5" fill="rgba(255,255,255,0.04)"/>
  <!-- Progress bar fill -->
  <rect x="28" y="228" width="${progressWidth}" height="10" rx="5" fill="url(#bar)"/>
  <!-- Progress bar glow -->
  ${progressWidth > 0 ? `<rect x="28" y="228" width="${progressWidth}" height="10" rx="5" fill="url(#bar)" opacity="0.4" filter="url(#softGlow)"/>` : ''}

  <!-- Divider -->
  <line x1="28" y1="262" x2="452" y2="262" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

  <!-- Footer: Built by -->
  <!-- Creator avatar circle -->
  <circle cx="46" cy="288" r="14" fill="url(#bar)"/>
  <text x="46" y="293" font-family="-apple-system,sans-serif" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">S</text>

  <!-- Creator info -->
  <text x="66" y="283" font-family="'SF Mono','Fira Code',monospace" font-size="8" fill="#475569" letter-spacing="1">BUILT BY</text>
  <text x="66" y="296" font-family="-apple-system,sans-serif" font-size="11" font-weight="600" fill="#e2e8f0">Sachin Shah</text>

  <!-- GitHub handle -->
  <g transform="translate(310, 276)">
    <rect width="80" height="22" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
    <path d="M12 4C8.69 4 6 6.37 6 9.29c0 2.38 1.63 4.42 3.9 5.16.28.05.38-.12.38-.26 0-.13-.01-.57-.01-.99-1.43.26-1.8-.33-1.92-.63-.06-.16-.34-.63-.58-.76-.2-.1-.48-.36 0-.37.45 0 .77.39.88.56.51.81 1.33.58 1.66.44.05-.35.2-.58.36-.72-1.27-.14-2.6-.6-2.6-2.66 0-.59.22-1.07.58-1.45-.06-.14-.26-.69.06-1.43 0 0 .48-.14 1.57.56.46-.12.94-.18 1.43-.18s.97.06 1.43.18c1.09-.71 1.57-.56 1.57-.56.31.74.12 1.29.06 1.43.37.37.58.86.58 1.45 0 2.07-1.34 2.51-2.61 2.65.21.17.39.49.39 1 0 .72-.01 1.3-.01 1.48 0 .14.1.31.38.26A5.44 5.44 0 0018 9.29C18 6.37 15.31 4 12 4z" fill="#94a3b8" transform="translate(2, 3) scale(0.7)"/>
    <text x="22" y="15" font-family="'SF Mono','Fira Code',monospace" font-size="8" fill="#94a3b8">imsachinshah</text>
  </g>

  <!-- X / Twitter handle -->
  <g transform="translate(396, 276)">
    <rect width="62" height="22" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
    <text x="10" y="15" font-family="'SF Mono','Fira Code',monospace" font-size="9" font-weight="700" fill="#94a3b8">𝕏</text>
    <text x="20" y="15" font-family="'SF Mono','Fira Code',monospace" font-size="8" fill="#94a3b8">sachinshah0</text>
  </g>

  <!-- Subtle branding -->
  <text x="240" y="324" font-family="'SF Mono','Fira Code',monospace" font-size="7" fill="rgba(124,58,237,0.15)" text-anchor="middle" letter-spacing="3">CODEKARMA FOR VS CODE</text>
</svg>`;
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
