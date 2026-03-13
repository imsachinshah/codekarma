import { Rank } from './types';

export const RANKS: Rank[] = [
  { name: 'Intern',    emoji: '🐣', minScore: 0 },
  { name: 'Junior',    emoji: '🌱', minScore: 100 },
  { name: 'Mid',       emoji: '⚡', minScore: 500 },
  { name: 'Senior',    emoji: '🔥', minScore: 1500 },
  { name: 'Staff',     emoji: '💎', minScore: 4000 },
  { name: '10x Dev',   emoji: '🚀', minScore: 10000 },
  { name: 'God Mode',  emoji: '👑', minScore: 25000 },
];

export const POINTS = {
  SUCCESS_BASE: 5,
  FAILURE_BASE: -10,
  STREAK_5_BONUS: 2,
  STREAK_10_BONUS: 5,
  STREAK_25_BONUS: 10,
  HEARTBREAK_PENALTY: -5,
  MIN_SCORE: 0,
};

export const DEFAULT_KARMA_DATA = {
  score: 0,
  streak: 0,
  longestStreak: 0,
  totalCommands: 0,
  totalFailures: 0,
  totalSuccesses: 0,
  rankIndex: 0,
  dailyStats: {},
  lastCommandTimestamp: 0,
  lastReportDate: '',
};
