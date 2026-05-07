import * as vscode from 'vscode';
import { KarmaStore } from './karma/KarmaStore';
import { KarmaEngine } from './karma/KarmaEngine';
import { RankSystem } from './karma/RankSystem';
import { TerminalWatcher } from './terminal/TerminalWatcher';
import { RoastEngine } from './roast/RoastEngine';
import { SoundPlayer } from './sound/SoundPlayer';
import { StatusBarManager } from './ui/StatusBarManager';
import { NotificationManager } from './ui/NotificationManager';
import { BadgeCardGenerator } from './ui/BadgeCardGenerator';
import { DashboardPanel } from './ui/DashboardPanel';
import { Scheduler } from './util/Scheduler';

export function activate(context: vscode.ExtensionContext) {
  // Core systems
  const store = new KarmaStore(context);
  const rankSystem = new RankSystem();
  const karmaEngine = new KarmaEngine(store, rankSystem);
  const terminalWatcher = new TerminalWatcher();
  const roastEngine = new RoastEngine();
  const soundPlayer = new SoundPlayer(context.extensionPath);
  const statusBar = new StatusBarManager(store, rankSystem);
  const notifications = new NotificationManager(store, rankSystem);
  const badgeGenerator = new BadgeCardGenerator(store, rankSystem);
  const scheduler = new Scheduler(store, notifications);

  // Start daily report scheduler
  scheduler.start();

  const isEnabled = () =>
    vscode.workspace.getConfiguration('codekarma').get<boolean>('enabled', true);

  // Main event loop: terminal command → karma → UI updates
  function attachCommandListener(): vscode.Disposable {
    return terminalWatcher.onCommandResult(async (result) => {
      const event = await karmaEngine.processCommand(result);

      statusBar.update();
      DashboardPanel.refresh(store, rankSystem);

      if (!result.success) {
        soundPlayer.playError();
        const roast = await roastEngine.getRoast(result.command, result.exitCode);
        notifications.showRoast(roast, event);
      }

      if (event.rankChanged) {
        if (event.newRank.minScore > (event.oldRank?.minScore ?? 0)) {
          soundPlayer.playLevelUp();
          notifications.showRankUp(event);
        } else {
          notifications.showRankDown(event);
        }
      }

      if (result.success && [5, 10, 25, 50, 100].includes(event.streak)) {
        soundPlayer.playStreak();
        notifications.showStreakMilestone(event.streak);
      }
    });
  }

  let commandListener: vscode.Disposable | null = isEnabled() ? attachCommandListener() : null;

  // Detach/reattach listener when enabled/disabled — no config reads in the hot path
  const configListener = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('codekarma.enabled')) {
      if (isEnabled()) {
        commandListener = commandListener ?? attachCommandListener();
      } else {
        commandListener?.dispose();
        commandListener = null;
      }
      statusBar.update();
    }
  });

  // Register commands
  const showDashboard = vscode.commands.registerCommand('codekarma.showDashboard', () => {
    DashboardPanel.show(store, rankSystem, context.extensionUri);
  });

  const generateBadge = vscode.commands.registerCommand('codekarma.generateBadge', () => {
    badgeGenerator.generate();
  });

  const resetKarma = vscode.commands.registerCommand('codekarma.resetKarma', async () => {
    const confirm = await vscode.window.showWarningMessage(
      'Reset all CodeKarma data? This cannot be undone!',
      { modal: true },
      'Reset',
    );
    if (confirm === 'Reset') {
      await store.reset();
      statusBar.update();
      vscode.window.showInformationMessage('CodeKarma: All data reset. Fresh start!');
    }
  });

  const toggleSound = vscode.commands.registerCommand('codekarma.toggleSound', async () => {
    const config = vscode.workspace.getConfiguration('codekarma');
    const current = config.get<boolean>('soundEnabled', true);
    await config.update('soundEnabled', !current, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(
      `CodeKarma: Sound ${!current ? 'enabled' : 'disabled'}`,
    );
  });

  const setRoastLevel = vscode.commands.registerCommand('codekarma.setRoastLevel', async () => {
    const pick = await vscode.window.showQuickPick(
      [
        { label: '😊 Mild', description: 'Gentle nudges — safe for work', value: 'mild' },
        { label: '🌶️ Medium', description: 'Spicy but fair', value: 'medium' },
        { label: '💀 Savage', description: 'No mercy. You asked for this.', value: 'savage' },
        { label: '🇮🇳 Desi', description: 'Indian uncle energy — "Log kya kahenge?"', value: 'desi' },
      ],
      { placeHolder: 'How hard should CodeKarma roast you?' },
    );
    if (pick) {
      const config = vscode.workspace.getConfiguration('codekarma');
      await config.update('roastLevel', (pick as any).value, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`CodeKarma: Roast level set to ${pick.label}`);
    }
  });

  const showDailyReport = vscode.commands.registerCommand('codekarma.showDailyReport', () => {
    notifications.showDailyReport();
  });

  const toggle = vscode.commands.registerCommand('codekarma.toggle', async () => {
    const config = vscode.workspace.getConfiguration('codekarma');
    const current = config.get<boolean>('enabled', true);
    await config.update('enabled', !current, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(
      `CodeKarma: ${!current ? 'Enabled' : 'Disabled'}`,
    );
  });

  // Push all disposables
  context.subscriptions.push(
    { dispose: () => commandListener?.dispose() },
    configListener,
    terminalWatcher,
    karmaEngine,
    statusBar,
    scheduler,
    showDashboard,
    generateBadge,
    resetKarma,
    toggleSound,
    setRoastLevel,
    showDailyReport,
    toggle,
  );

  console.log('CodeKarma activated! May the karma be with you.');
}

export function deactivate() {}
