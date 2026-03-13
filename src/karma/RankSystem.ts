import { Rank } from '../types';
import { RANKS } from '../constants';

export class RankSystem {
  getRank(score: number): Rank {
    let rank = RANKS[0];
    for (const r of RANKS) {
      if (score >= r.minScore) {
        rank = r;
      }
    }
    return rank;
  }

  getRankIndex(score: number): number {
    let index = 0;
    for (let i = 0; i < RANKS.length; i++) {
      if (score >= RANKS[i].minScore) {
        index = i;
      }
    }
    return index;
  }

  checkPromotion(oldScore: number, newScore: number): { promoted: boolean; demoted: boolean; newRank: Rank; oldRank: Rank } {
    const oldRank = this.getRank(oldScore);
    const newRank = this.getRank(newScore);
    return {
      promoted: this.getRankIndex(newScore) > this.getRankIndex(oldScore),
      demoted: this.getRankIndex(newScore) < this.getRankIndex(oldScore),
      newRank,
      oldRank,
    };
  }

  getNextRank(score: number): Rank | null {
    const currentIndex = this.getRankIndex(score);
    return currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : null;
  }

  getProgressToNext(score: number): number {
    const currentIndex = this.getRankIndex(score);
    if (currentIndex >= RANKS.length - 1) return 100;
    const current = RANKS[currentIndex].minScore;
    const next = RANKS[currentIndex + 1].minScore;
    return Math.round(((score - current) / (next - current)) * 100);
  }
}
