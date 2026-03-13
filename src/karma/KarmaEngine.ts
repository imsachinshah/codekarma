import * as vscode from 'vscode';
import { CommandResult, KarmaEvent } from '../types';
import { POINTS } from '../constants';
import { KarmaStore } from './KarmaStore';
import { RankSystem } from './RankSystem';

export class KarmaEngine {
  private readonly _onKarmaEvent = new vscode.EventEmitter<KarmaEvent>();
  readonly onKarmaEvent = this._onKarmaEvent.event;

  constructor(
    private store: KarmaStore,
    private rankSystem: RankSystem,
  ) {}

  async processCommand(result: CommandResult): Promise<KarmaEvent> {
    const data = this.store.get();
    const oldScore = data.score;
    let scoreDelta = 0;

    if (result.success) {
      // Success scoring
      scoreDelta = POINTS.SUCCESS_BASE;
      data.streak += 1;
      data.totalSuccesses += 1;

      // Streak bonuses
      if (data.streak >= 25) {
        scoreDelta += POINTS.STREAK_25_BONUS;
      } else if (data.streak >= 10) {
        scoreDelta += POINTS.STREAK_10_BONUS;
      } else if (data.streak >= 5) {
        scoreDelta += POINTS.STREAK_5_BONUS;
      }

      if (data.streak > data.longestStreak) {
        data.longestStreak = data.streak;
      }
    } else {
      // Failure scoring
      scoreDelta = POINTS.FAILURE_BASE;
      data.totalFailures += 1;

      // Heartbreak penalty if breaking a big streak
      if (data.streak >= 10) {
        scoreDelta += POINTS.HEARTBREAK_PENALTY;
      }

      data.streak = 0;
    }

    data.score = Math.max(POINTS.MIN_SCORE, oldScore + scoreDelta);
    data.totalCommands += 1;
    data.lastCommandTimestamp = result.timestamp;

    // Update daily stats
    const todayKey = this.store.getTodayKey();
    const daily = data.dailyStats[todayKey] ?? { successes: 0, failures: 0, scoreChange: 0 };
    if (result.success) {
      daily.successes += 1;
    } else {
      daily.failures += 1;
    }
    daily.scoreChange += scoreDelta;
    data.dailyStats[todayKey] = daily;

    // Check rank change
    const { promoted, demoted, newRank, oldRank } = this.rankSystem.checkPromotion(oldScore, data.score);
    data.rankIndex = this.rankSystem.getRankIndex(data.score);

    await this.store.update(data);

    const event: KarmaEvent = {
      result,
      scoreDelta,
      newScore: data.score,
      streak: data.streak,
      rankChanged: promoted || demoted,
      newRank,
      oldRank,
    };

    this._onKarmaEvent.fire(event);
    return event;
  }

  dispose(): void {
    this._onKarmaEvent.dispose();
  }
}
