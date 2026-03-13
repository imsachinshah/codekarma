import * as vscode from 'vscode';
import * as path from 'path';
import { execSync } from 'child_process';
import { KarmaStore } from '../karma/KarmaStore';
import { RankSystem } from '../karma/RankSystem';
import { RANKS } from '../constants';

export class DashboardPanel {
  private static panel: vscode.WebviewPanel | undefined;

  static show(store: KarmaStore, rankSystem: RankSystem, extensionUri?: vscode.Uri): void {
    if (DashboardPanel.panel) {
      DashboardPanel.panel.reveal();
      DashboardPanel.panel.webview.html = DashboardPanel.getHtml(store, rankSystem);
      return;
    }

    DashboardPanel.panel = vscode.window.createWebviewPanel(
      'codekarma.dashboard',
      'CodeKarma Dashboard',
      vscode.ViewColumn.One,
      { enableScripts: false },
    );

    if (extensionUri) {
      DashboardPanel.panel.iconPath = {
        light: vscode.Uri.joinPath(extensionUri, 'media', 'icons', 'codekarma-light.svg'),
        dark: vscode.Uri.joinPath(extensionUri, 'media', 'icons', 'codekarma-dark.svg'),
      };
    }

    DashboardPanel.panel.webview.html = DashboardPanel.getHtml(store, rankSystem);

    DashboardPanel.panel.onDidDispose(() => {
      DashboardPanel.panel = undefined;
    });
  }

  static refresh(store: KarmaStore, rankSystem: RankSystem): void {
    if (DashboardPanel.panel) {
      DashboardPanel.panel.webview.html = DashboardPanel.getHtml(store, rankSystem);
    }
  }

  private static getUsername(): { name: string; github: string } {
    const config = vscode.workspace.getConfiguration('codekarma');
    const customName = config.get<string>('badgeUsername', '');

    let name = 'Developer';
    let github = '';

    // Try git config for username
    try {
      name = execSync('git config user.name', { encoding: 'utf-8' }).trim() || name;
    } catch { /* fallback */ }

    // Try to get GitHub username from git remote
    try {
      const remote = execSync('git config remote.origin.url', { encoding: 'utf-8' }).trim();
      const match = remote.match(/github\.com[:/]([^/]+)/);
      if (match) {
        github = match[1];
      }
    } catch { /* fallback */ }

    // Try git config github.user
    if (!github) {
      try {
        github = execSync('git config github.user', { encoding: 'utf-8' }).trim();
      } catch { /* fallback */ }
    }

    if (customName) {
      name = customName;
    }

    return { name, github };
  }

  private static getHtml(store: KarmaStore, rankSystem: RankSystem): string {
    const data = store.get();
    const rank = rankSystem.getRank(data.score);
    const nextRank = rankSystem.getNextRank(data.score);
    const progress = rankSystem.getProgressToNext(data.score);
    const { name: username, github: githubId } = DashboardPanel.getUsername();
    const initial = username.charAt(0).toUpperCase();
    const successRate = data.totalCommands > 0
      ? Math.round((data.totalSuccesses / data.totalCommands) * 100)
      : 0;

    // Last 7 days stats
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayStats = data.dailyStats[key] ?? { successes: 0, failures: 0, scoreChange: 0 };
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days.push({ date: key.slice(5), dayName, ...dayStats });
    }

    const maxDayTotal = Math.max(1, ...last7Days.map(d => d.successes + d.failures));

    const rankListHtml = RANKS.map((r, i) => {
      const isCurrent = r.name === rank.name;
      const achieved = data.score >= r.minScore;
      return `<div class="rank-item${isCurrent ? ' rank-current' : ''}${achieved && !isCurrent ? ' rank-achieved' : ''}${!achieved ? ' rank-locked' : ''}" style="animation-delay:${i * 60}ms">
        <span class="rank-emoji">${r.emoji}</span>
        <div class="rank-info">
          <span class="rank-name">${r.name}</span>
          <span class="rank-score">${r.minScore.toLocaleString()}+</span>
        </div>
        ${isCurrent ? '<span class="rank-badge">YOU</span>' : ''}
      </div>`;
    }).join('');

    const weekChartHtml = last7Days.map((d, i) => {
      const total = d.successes + d.failures;
      const height = Math.max(4, (total / maxDayTotal) * 120);
      const successHeight = total > 0 ? (d.successes / total) * height : 0;
      const failHeight = height - successHeight;
      const isToday = i === last7Days.length - 1;
      return `<div class="chart-col${isToday ? ' chart-today' : ''}" style="animation-delay:${i * 80}ms">
        <div class="chart-value">${total > 0 ? total : ''}</div>
        <div class="chart-bar-wrapper">
          ${failHeight > 0 ? `<div class="chart-bar chart-bar-fail" style="height:${failHeight}px"></div>` : ''}
          ${successHeight > 0 ? `<div class="chart-bar chart-bar-success" style="height:${successHeight}px"></div>` : ''}
          ${total === 0 ? '<div class="chart-bar chart-bar-empty" style="height:4px"></div>' : ''}
        </div>
        <span class="chart-label">${d.dayName}</span>
        <span class="chart-date">${d.date}</span>
      </div>`;
    }).join('');

    // Success rate ring (SVG donut)
    const circumference = 2 * Math.PI * 38;
    const successOffset = circumference - (successRate / 100) * circumference;

    // Streak copy
    const streakTitle = data.streak > 0 ? 'On Fire' : 'Streak';
    const streakSub = data.streak === 0 ? 'Run a clean command. Start the fire.' : '';

    return `<!DOCTYPE html>
<html>
<head>
  <style>
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #0a0a1a;
      color: #e2e8f0;
      min-height: 100vh;
      padding: 0;
    }

    /* Ambient background glow */
    body::before {
      content: '';
      position: fixed;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(ellipse at 25% 15%, rgba(124, 58, 237, 0.07) 0%, transparent 50%),
                  radial-gradient(ellipse at 75% 85%, rgba(244, 63, 94, 0.04) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }

    /* ── Navbar ── */
    .navbar {
      position: sticky;
      top: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 28px;
      background: rgba(10, 10, 26, 0.85);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      animation: fadeInDown 0.4s ease-out;
    }
    .nav-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav-logo {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, #7c3aed, #f43f5e);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .nav-brand {
      font-size: 15px;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.3px;
    }
    .nav-center {
      font-size: 12px;
      color: #64748b;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .nav-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #7c3aed;
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .nav-github {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #94a3b8;
      text-decoration: none;
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(255, 255, 255, 0.03);
    }
    .nav-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
      border: 2px solid rgba(124, 58, 237, 0.4);
    }

    /* ── Main Content ── */
    .dashboard {
      max-width: 960px;
      margin: 0 auto;
      padding: 24px 28px 32px;
      position: relative;
      z-index: 1;
    }

    /* ── Grid ── */
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    /* ── Glass Card ── */
    .card {
      background: linear-gradient(135deg, rgba(30, 30, 60, 0.8), rgba(15, 15, 40, 0.6));
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 22px;
      position: relative;
      overflow: hidden;
      animation: fadeInUp 0.4s ease-out both;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    }
    .card-full { grid-column: 1 / -1; }

    /* ── Hero Score Card ── */
    .hero-card {
      grid-column: 1 / -1;
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(244, 63, 94, 0.06), rgba(15, 15, 40, 0.9));
      border: 1px solid rgba(124, 58, 237, 0.2);
      padding: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }
    .hero-left { flex: 1; }
    .hero-rank {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(124, 58, 237, 0.15);
      border: 1px solid rgba(124, 58, 237, 0.3);
      border-radius: 20px;
      padding: 4px 14px 4px 8px;
      font-size: 13px;
      font-weight: 600;
      color: #a78bfa;
      margin-bottom: 14px;
    }
    .hero-rank-emoji { font-size: 16px; }
    .hero-score {
      font-size: 52px;
      font-weight: 800;
      font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', monospace;
      background: linear-gradient(135deg, #c084fc, #f472b6, #fb923c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      letter-spacing: -2px;
    }
    .hero-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      margin-top: 4px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .hero-right { text-align: right; }
    .hero-next {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .hero-next strong { color: #a78bfa; }
    .progress-track {
      width: 200px;
      height: 8px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      overflow: hidden;
      margin-left: auto;
    }
    .progress-fill {
      height: 100%;
      border-radius: 4px;
      background: linear-gradient(90deg, #7c3aed, #f43f5e);
      box-shadow: 0 0 12px rgba(124, 58, 237, 0.4);
      animation: progressGrow 1s ease-out;
    }
    .progress-pct {
      font-size: 11px;
      color: #7c3aed;
      font-weight: 600;
      text-align: right;
      margin-top: 4px;
      font-family: monospace;
    }
    .hero-max {
      font-size: 13px;
      font-weight: 700;
      color: #fbbf24;
      letter-spacing: 2px;
      text-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
    }

    /* ── Three-Col Stats Row ── */
    .stats-row {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 14px;
    }
    .mini-card {
      background: linear-gradient(135deg, rgba(30, 30, 60, 0.8), rgba(15, 15, 40, 0.6));
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      animation: fadeInUp 0.4s ease-out both;
    }
    .mini-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    }
    .mini-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .mini-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mini-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .mini-value {
      font-size: 32px;
      font-weight: 800;
      font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', monospace;
      line-height: 1;
      letter-spacing: -1px;
    }
    .mini-sub {
      font-size: 11px;
      color: #475569;
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .mini-sub-val {
      font-weight: 700;
      font-family: monospace;
    }

    /* ── Success Rate Ring ── */
    .rate-card {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .rate-ring { flex-shrink: 0; }
    .rate-ring svg { transform: rotate(-90deg); }
    .rate-ring-track { fill: none; stroke: rgba(255, 255, 255, 0.06); stroke-width: 6; }
    .rate-ring-fill {
      fill: none;
      stroke-width: 6;
      stroke-linecap: round;
      animation: ringFill 1.2s ease-out;
    }
    .rate-center {
      font-size: 20px;
      font-weight: 800;
      font-family: monospace;
      fill: #f8fafc;
    }
    .rate-details { flex: 1; }
    .rate-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 0;
    }
    .rate-row + .rate-row { border-top: 1px solid rgba(255, 255, 255, 0.04); }
    .rate-row-label { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 6px; }
    .rate-row-val { font-size: 13px; font-weight: 700; font-family: monospace; }
    .rate-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* ── Rank Ladder ── */
    .card-title {
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .card-subtitle {
      font-size: 11px;
      color: #475569;
      margin-bottom: 14px;
    }
    .rank-list { display: flex; flex-direction: column; gap: 5px; }
    .rank-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 10px;
      border-radius: 10px;
      border: 1px solid transparent;
      animation: fadeInUp 0.3s ease-out both;
    }
    .rank-current {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(244, 63, 94, 0.1));
      border-color: rgba(124, 58, 237, 0.3);
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.08);
    }
    .rank-achieved { opacity: 0.5; }
    .rank-locked { opacity: 0.2; }
    .rank-emoji { font-size: 18px; width: 24px; text-align: center; }
    .rank-info { flex: 1; display: flex; justify-content: space-between; align-items: center; }
    .rank-name { font-size: 12px; font-weight: 500; }
    .rank-current .rank-name { color: #c084fc; font-weight: 700; }
    .rank-score { font-size: 10px; color: #475569; font-family: monospace; }
    .rank-badge {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #7c3aed, #f43f5e);
      color: #fff;
      padding: 2px 7px;
      border-radius: 6px;
    }

    /* ── Weekly Chart ── */
    .chart-row {
      display: flex;
      gap: 6px;
      justify-content: center;
      align-items: flex-end;
    }
    .chart-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      flex: 1;
      animation: fadeInUp 0.4s ease-out both;
    }
    .chart-value {
      font-size: 9px;
      font-weight: 600;
      color: #64748b;
      font-family: monospace;
      height: 14px;
    }
    .chart-bar-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 120px;
      width: 100%;
    }
    .chart-bar {
      width: 100%;
      min-width: 24px;
      border-radius: 5px;
    }
    .chart-bar-success {
      background: linear-gradient(180deg, #22c55e, #16a34a);
      border-radius: 0 0 5px 5px;
    }
    .chart-bar-fail {
      background: linear-gradient(180deg, #f43f5e, #e11d48);
      border-radius: 5px 5px 0 0;
    }
    .chart-bar-empty {
      background: rgba(255, 255, 255, 0.04);
      border-radius: 5px;
    }
    .chart-today .chart-bar-success {
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
    }
    .chart-label {
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
    }
    .chart-date {
      font-size: 8px;
      color: #475569;
      font-family: monospace;
    }
    .chart-today .chart-label { color: #f8fafc; }
    .chart-legend {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 12px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 10px;
      color: #64748b;
    }
    .legend-dot {
      width: 7px;
      height: 7px;
      border-radius: 3px;
    }

    /* ── Footer / Built By ── */
    .footer {
      margin-top: 20px;
      padding: 20px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: fadeInUp 0.4s ease-out 0.35s both;
    }
    .footer-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .footer-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #f43f5e);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
    }
    .footer-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .footer-built {
      font-size: 10px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .footer-name {
      font-size: 13px;
      font-weight: 600;
      color: #e2e8f0;
    }
    .footer-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .footer-github {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #94a3b8;
      padding: 5px 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(255, 255, 255, 0.03);
      text-decoration: none;
    }
    .footer-linkedin {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #94a3b8;
      padding: 5px 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(255, 255, 255, 0.03);
      text-decoration: none;
    }
    .footer-tagline {
      font-size: 10px;
      color: #334155;
      text-align: center;
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }

    /* ── Animations ── */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes progressGrow {
      from { width: 0; }
    }
    @keyframes ringFill {
      from { stroke-dashoffset: ${circumference}; }
    }
  </style>
</head>
<body>

  <!-- ── Navbar ── -->
  <nav class="navbar">
    <div class="nav-left">
      <div class="nav-logo">
        <svg viewBox="0 0 16 16" width="18" height="18"><text x="0.5" y="12" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="#ffffff" transform="rotate(-12, 5, 9)">{</text><text x="7.5" y="11" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="#ffffff" transform="rotate(12, 11, 8)">}</text><circle cx="8" cy="1.8" r="1.2" fill="#ff6a00"/></svg>
      </div>
      <span class="nav-brand">CodeKarma</span>
    </div>
    <div class="nav-center">
      <span class="nav-dot"></span>
      Every command counts
    </div>
    <div class="nav-right">
      ${githubId ? `<span class="nav-github">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#94a3b8"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        ${githubId}
      </span>` : ''}
      <div class="nav-avatar">${initial}</div>
    </div>
  </nav>

  <!-- ── Dashboard Content ── -->
  <div class="dashboard">

    <!-- ── Hero Karma Card ── -->
    <div class="grid">
      <div class="card hero-card" style="animation-delay:0.05s">
        <div class="hero-left">
          <div class="hero-rank">
            <span class="hero-rank-emoji">${rank.emoji}</span>
            ${rank.name}
          </div>
          <div class="hero-score">${data.score.toLocaleString()}</div>
          <div class="hero-label">Karma Points</div>
        </div>
        <div class="hero-right">
          ${nextRank ? `
          <div class="hero-next">Next: <strong>${nextRank.emoji} ${nextRank.name}</strong></div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${progress}%"></div>
          </div>
          <div class="progress-pct">${progress}% &middot; ${(nextRank.minScore - data.score).toLocaleString()} to go</div>
          ` : '<div class="hero-max">MAX RANK</div>'}
        </div>
      </div>

      <!-- ── Three Stats Row ── -->
      <div class="stats-row">
        <!-- Streak -->
        <div class="mini-card" style="animation-delay:0.1s">
          <div class="mini-header">
            <span class="mini-label">${streakTitle}</span>
            <div class="mini-icon" style="background:rgba(34,197,94,0.1)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
          </div>
          <div class="mini-value" style="color:#22c55e">${data.streak}</div>
          ${streakSub ? `<div class="mini-sub" style="color:#475569">${streakSub}</div>` : `<div class="mini-sub">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span class="mini-sub-val" style="color:#fbbf24">${data.longestStreak}</span>
            <span>best</span>
          </div>`}
        </div>

        <!-- Commands -->
        <div class="mini-card" style="animation-delay:0.15s">
          <div class="mini-header">
            <span class="mini-label">Commands</span>
            <div class="mini-icon" style="background:rgba(96,165,250,0.1)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            </div>
          </div>
          <div class="mini-value" style="color:#60a5fa">${data.totalCommands.toLocaleString()}</div>
          <div class="mini-sub">
            <span class="mini-sub-val" style="color:#22c55e">${data.totalSuccesses}</span>
            <span>passed</span>
            <span style="color:#334155">/</span>
            <span class="mini-sub-val" style="color:#f43f5e">${data.totalFailures}</span>
            <span>failed</span>
          </div>
        </div>

        <!-- Hit Rate -->
        <div class="mini-card rate-card" style="animation-delay:0.2s">
          <div>
            <span class="mini-label">Hit Rate</span>
            <div style="display:flex;align-items:center;gap:16px;margin-top:10px">
              <div class="rate-ring">
                <svg width="80" height="80" viewBox="0 0 90 90">
                  <circle class="rate-ring-track" cx="45" cy="45" r="38"/>
                  <circle class="rate-ring-fill" cx="45" cy="45" r="38"
                    stroke="${successRate >= 70 ? '#22c55e' : successRate >= 40 ? '#f59e0b' : '#f43f5e'}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${successOffset}"/>
                  <text class="rate-center" x="45" y="45" text-anchor="middle" dominant-baseline="central" transform="rotate(90 45 45)">${successRate}%</text>
                </svg>
              </div>
              <div class="rate-details">
                <div class="rate-row">
                  <span class="rate-row-label"><span class="rate-dot" style="background:#22c55e"></span>Pass</span>
                  <span class="rate-row-val" style="color:#22c55e">${data.totalSuccesses}</span>
                </div>
                <div class="rate-row">
                  <span class="rate-row-label"><span class="rate-dot" style="background:#f43f5e"></span>Fail</span>
                  <span class="rate-row-val" style="color:#f43f5e">${data.totalFailures}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Rank Ladder + Weekly Chart (side by side) ── -->
      <!-- Rank Ladder -->
      <div class="card" style="animation-delay:0.25s">
        <div class="card-title">Climb the Ladder</div>
        <div class="card-subtitle">Ship clean code. Level up.</div>
        <div class="rank-list">${rankListHtml}</div>
      </div>

      <!-- Weekly Chart -->
      <div class="card" style="animation-delay:0.3s">
        <div class="card-title">This Week</div>
        <div class="card-subtitle">Your 7-day command history</div>
        <div class="chart-row">
          ${weekChartHtml}
        </div>
        <div class="chart-legend">
          <div class="legend-item"><div class="legend-dot" style="background:#22c55e"></div> success</div>
          <div class="legend-item"><div class="legend-dot" style="background:#f43f5e"></div> failure</div>
        </div>
      </div>
    </div>

    <!-- ── Built By Footer ── -->
    <div class="footer">
      <div class="footer-left">
        <div class="footer-avatar">S</div>
        <div class="footer-info">
          <span class="footer-built">Built by</span>
          <span class="footer-name">Sachin Shah</span>
        </div>
      </div>
      <div class="footer-right">
        <span class="footer-github">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#94a3b8"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          @imsachinshah
        </span>
        <span class="footer-linkedin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#94a3b8"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
          @imsachinshah0
        </span>
      </div>
    </div>
    <div class="footer-tagline">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      Built for devs who ship
    </div>
  </div>

</body>
</html>`;
  }
}
