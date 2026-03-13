import * as vscode from 'vscode';
import { CommandResult } from '../types';

export class TerminalWatcher {
  private readonly _onCommandResult = new vscode.EventEmitter<CommandResult>();
  readonly onCommandResult = this._onCommandResult.event;
  private disposable: vscode.Disposable;

  constructor() {
    this.disposable = vscode.window.onDidEndTerminalShellExecution((event) => {
      const exitCode = event.exitCode;
      const command = event.execution.commandLine?.value ?? 'unknown';

      // Skip empty or whitespace-only commands
      if (!command.trim() || command === 'unknown') return;

      this._onCommandResult.fire({
        command,
        exitCode: exitCode ?? 1,
        success: exitCode === 0,
        timestamp: Date.now(),
      });
    });
  }

  dispose(): void {
    this.disposable.dispose();
    this._onCommandResult.dispose();
  }
}
