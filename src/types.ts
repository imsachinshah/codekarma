export interface KarmaData {
  score: number;
  streak: number;
  longestStreak: number;
  totalCommands: number;
  totalFailures: number;
  totalSuccesses: number;
  rankIndex: number;
  dailyStats: Record<string, DailyStats>;
  lastCommandTimestamp: number;
  lastReportDate: string;
}

export interface DailyStats {
  successes: number;
  failures: number;
  scoreChange: number;
}

export interface CommandResult {
  command: string;
  exitCode: number;
  success: boolean;
  timestamp: number;
}

export type RoastLevel = 'mild' | 'medium' | 'savage' | 'desi';

export interface Rank {
  name: string;
  emoji: string;
  minScore: number;
}

export interface KarmaEvent {
  result: CommandResult;
  scoreDelta: number;
  newScore: number;
  streak: number;
  rankChanged: boolean;
  newRank: Rank;
  oldRank?: Rank;
}
