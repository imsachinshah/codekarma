import { exec } from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

export class SoundPlayer {
  private extensionPath: string;

  constructor(extensionPath: string) {
    this.extensionPath = extensionPath;
  }

  play(soundName: string): void {
    const config = vscode.workspace.getConfiguration('codekarma');
    if (!config.get<boolean>('soundEnabled', true)) return;

    const soundFile = path.join(this.extensionPath, 'media', 'sounds', `${soundName}.mp3`);
    const platform = process.platform;
    let command: string;

    if (platform === 'darwin') {
      command = `afplay "${soundFile}"`;
    } else if (platform === 'win32') {
      // Windows: use PowerShell with Windows Media Player for MP3 support
      command = `powershell -c "Add-Type -AssemblyName presentationCore; $p = New-Object System.Windows.Media.MediaPlayer; $p.Open([uri]'${soundFile}'); $p.Play(); Start-Sleep -Seconds 3"`;

    } else {
      // Linux: try multiple players
      command = `paplay "${soundFile}" 2>/dev/null || aplay "${soundFile}" 2>/dev/null || ffplay -nodisp -autoexit "${soundFile}" 2>/dev/null`;
    }

    exec(command, (err) => {
      if (err) {
        // Silently fail — missing audio player shouldn't crash extension
        console.log('CodeKarma: Sound playback not available');
      }
    });
  }

  playError(): void {
    const config = vscode.workspace.getConfiguration('codekarma');
    const soundEffect = config.get<string>('soundEffect', 'faaah');
    this.play(soundEffect);
  }

  playLevelUp(): void {
    this.play('levelup');
  }

  playStreak(): void {
    this.play('streak');
  }
}
