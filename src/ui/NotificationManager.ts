import * as vscode from 'vscode';
import { KarmaEvent } from '../types';
import { KarmaStore } from '../karma/KarmaStore';
import { RankSystem } from '../karma/RankSystem';

export class NotificationManager {
  constructor(
    private store: KarmaStore,
    private rankSystem: RankSystem,
  ) {}

  showRoast(roast: string, event: KarmaEvent): void {
    const scoreText = event.scoreDelta > 0
      ? `+${event.scoreDelta}`
      : `${event.scoreDelta}`;

    vscode.window.showWarningMessage(
      `${roast}  [${scoreText} karma]`,
    );
  }

  showStreakMilestone(streak: number): void {
    const messages: Record<number, string> = {
      5: `🔥 5 streak! You're warming up!`,
      10: `⚡ 10 streak! You're on FIRE!`,
      25: `🚀 25 streak! UNSTOPPABLE!`,
      50: `👑 50 streak! You're a MACHINE!`,
      100: `💀 100 streak! Are you even human?!`,
    };

    const msg = messages[streak];
    if (msg) {
      vscode.window.showInformationMessage(msg);
    }
  }

  showRankUp(event: KarmaEvent): void {
    vscode.window.showInformationMessage(
      `🎉 RANK UP! ${event.oldRank?.emoji} ${event.oldRank?.name} → ${event.newRank.emoji} ${event.newRank.name}! Karma: ${event.newScore}`,
      'Share Badge',
    ).then(selection => {
      if (selection === 'Share Badge') {
        vscode.commands.executeCommand('codekarma.generateBadge');
      }
    });
  }

  showRankDown(event: KarmaEvent): void {
    vscode.window.showWarningMessage(
      `📉 Demoted! ${event.oldRank?.emoji} ${event.oldRank?.name} → ${event.newRank.emoji} ${event.newRank.name}. Get it together!`,
    );
  }

  showDailyReport(): void {
    const data = this.store.get();
    const today = this.store.getTodayKey();
    const stats = data.dailyStats[today];

    if (!stats) {
      vscode.window.showInformationMessage('CodeKarma: No activity today yet!');
      return;
    }

    const rank = this.rankSystem.getRank(data.score);
    const total = stats.successes + stats.failures;
    const successRate = total > 0 ? Math.round((stats.successes / total) * 100) : 0;
    const scoreSign = stats.scoreChange >= 0 ? '+' : '';

    let verdict = '';
    if (stats.failures === 0) {
      verdict = 'Flawless day. Touch some grass.';
    } else if (successRate >= 80) {
      verdict = 'Solid day. Minor hiccups.';
    } else if (successRate >= 50) {
      verdict = 'Rough day. The bugs fought back.';
    } else {
      verdict = 'Disaster day. Consider a career change.';
    }

    vscode.window.showInformationMessage(
      `📊 Daily Damage Report: ${total} commands | ✅ ${stats.successes} | ❌ ${stats.failures} | ${scoreSign}${stats.scoreChange} karma | ${rank.emoji} ${rank.name} — ${verdict}`,
    );
  }
}
