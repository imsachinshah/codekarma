import * as vscode from 'vscode';
import { KarmaStore } from '../karma/KarmaStore';
import { NotificationManager } from '../ui/NotificationManager';

export class Scheduler {
  private interval: ReturnType<typeof setInterval> | undefined;

  constructor(
    private store: KarmaStore,
    private notifications: NotificationManager,
  ) {}

  start(): void {
    // Check every 30 minutes for day change
    this.interval = setInterval(() => {
      this.checkDailyReport();
    }, 30 * 60 * 1000);
  }

  private checkDailyReport(): void {
    const config = vscode.workspace.getConfiguration('codekarma');
    if (!config.get<boolean>('dailyReport', true)) return;

    const data = this.store.get();
    const today = this.store.getTodayKey();

    // If we already showed report today, skip
    if (data.lastReportDate === today) return;

    // Check if there's yesterday's data to report
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    const stats = data.dailyStats[yesterdayKey];
    if (stats && (stats.successes > 0 || stats.failures > 0)) {
      this.notifications.showDailyReport();
      this.store.update({ lastReportDate: today });
    }
  }

  dispose(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
