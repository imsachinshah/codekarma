import * as vscode from 'vscode';
import { KarmaStore } from '../karma/KarmaStore';
import { RankSystem } from '../karma/RankSystem';

export class StatusBarManager {
  private item: vscode.StatusBarItem;

  constructor(
    private store: KarmaStore,
    private rankSystem: RankSystem,
  ) {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.item.command = 'codekarma.showDashboard';
    this.item.tooltip = 'Click to open CodeKarma Dashboard';
    this.update();
    this.item.show();
  }

  update(): void {
    const data = this.store.get();
    const rank = this.rankSystem.getRank(data.score);
    const streakIcon = data.streak >= 5 ? '$(flame)' : '$(zap)';

    this.item.text = `${rank.emoji} ${data.score} | ${streakIcon} ${data.streak} | ${rank.name}`;

    // Color based on recent performance
    if (data.streak >= 10) {
      this.item.backgroundColor = undefined;
      this.item.color = '#4ade80'; // green
    } else if (data.streak === 0 && data.totalCommands > 0) {
      this.item.color = '#f87171'; // red
    } else {
      this.item.color = undefined;
    }
  }

  dispose(): void {
    this.item.dispose();
  }
}
