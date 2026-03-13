import * as vscode from 'vscode';
import { KarmaData, DailyStats } from '../types';
import { DEFAULT_KARMA_DATA } from '../constants';

const STORAGE_KEY = 'codekarma.data';

export class KarmaStore {
  constructor(private context: vscode.ExtensionContext) {}

  get(): KarmaData {
    return this.context.globalState.get<KarmaData>(STORAGE_KEY) ?? { ...DEFAULT_KARMA_DATA };
  }

  async update(data: Partial<KarmaData>): Promise<KarmaData> {
    const current = this.get();
    const updated = { ...current, ...data };
    await this.context.globalState.update(STORAGE_KEY, updated);
    return updated;
  }

  async updateDailyStats(date: string, stats: DailyStats): Promise<void> {
    const data = this.get();
    data.dailyStats[date] = stats;
    await this.context.globalState.update(STORAGE_KEY, data);
  }

  getTodayKey(): string {
    return new Date().toISOString().split('T')[0];
  }

  getTodayStats(): DailyStats {
    const data = this.get();
    return data.dailyStats[this.getTodayKey()] ?? { successes: 0, failures: 0, scoreChange: 0 };
  }

  async reset(): Promise<void> {
    await this.context.globalState.update(STORAGE_KEY, { ...DEFAULT_KARMA_DATA });
  }
}
