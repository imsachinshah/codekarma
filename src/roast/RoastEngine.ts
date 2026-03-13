import * as vscode from 'vscode';
import { RoastLevel } from '../types';
import { RoastBankProvider } from './RoastBank';
import { AiRoastProvider } from './AiRoastProvider';

export class RoastEngine {
  private bank: RoastBankProvider;
  private ai: AiRoastProvider;

  constructor() {
    this.bank = new RoastBankProvider();
    this.ai = new AiRoastProvider();
  }

  async getRoast(command: string, exitCode: number): Promise<string> {
    const config = vscode.workspace.getConfiguration('codekarma');
    const level = config.get<RoastLevel>('roastLevel', 'medium');
    const useAi = config.get<boolean>('useAiRoasts', false);

    // Try AI roast first if enabled
    if (useAi) {
      const aiRoast = await this.ai.getRoast(command, exitCode, level);
      if (aiRoast) return aiRoast;
    }

    // Fallback to local roast bank
    return this.bank.getRoast(level);
  }
}
