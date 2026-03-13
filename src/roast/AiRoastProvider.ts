import * as vscode from 'vscode';
import { RoastLevel } from '../types';

export class AiRoastProvider {
  async getRoast(command: string, exitCode: number, level: RoastLevel): Promise<string | null> {
    const config = vscode.workspace.getConfiguration('codekarma');
    const apiKey = config.get<string>('aiApiKey', '');
    const provider = config.get<string>('aiProvider', 'openai');

    if (!apiKey) return null;

    const levelDesc: Record<RoastLevel, string> = {
      mild: 'gentle and encouraging but slightly teasing',
      medium: 'sarcastic and witty, like a friend roasting you',
      savage: 'absolutely brutal, no mercy, devastating burn',
      desi: 'in Hinglish (Hindi-English mix), like a disappointed Indian uncle/aunty or friend. Use Hindi slang and cultural references',
    };

    const prompt = `You are a coding roast bot. A developer just ran this terminal command and it FAILED:
Command: "${command}" (exit code: ${exitCode})

Generate a single short funny roast (max 15 words) that is ${levelDesc[level]}.
Only return the roast text, nothing else.`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      let response: Response;

      if (provider === 'anthropic') {
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 60,
            messages: [{ role: 'user', content: prompt }],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);
        if (!response.ok) return null;

        const data = await response.json() as { content: Array<{ text: string }> };
        return data.content?.[0]?.text?.trim() ?? null;
      } else {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            max_tokens: 60,
            messages: [{ role: 'user', content: prompt }],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);
        if (!response.ok) return null;

        const data = await response.json() as { choices: Array<{ message: { content: string } }> };
        return data.choices?.[0]?.message?.content?.trim() ?? null;
      }
    } catch {
      return null;
    }
  }
}
