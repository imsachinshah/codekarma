import { RoastLevel } from '../types';

export const ROAST_BANK: Record<RoastLevel, string[]> = {
  mild: [
    "Oops! That didn't work. But hey, you're learning!",
    "Little hiccup there. You'll get it next time.",
    "Even the best devs make mistakes... you're not one of them, but still.",
    "That command had feelings, and you hurt them.",
    "Don't worry, the terminal won't judge you. I will though.",
    "Hmm, that didn't go as planned. Classic you.",
    "Error? Nah, let's call it an unplanned feature test.",
    "The terminal said no. Maybe try asking nicely?",
    "Typo or skill issue? I'll let you decide.",
    "Your code is doing its best. Unfortunately, its best isn't great.",
    "Baby steps. Baby... wobbly... falling steps.",
    "That's okay! Rome wasn't debugged in a day.",
    "Almost had it! ...not really, but I'm being supportive.",
    "If at first you don't succeed, try a different Stack Overflow answer.",
    "Your terminal just sighed.",
    "Plot twist: the computer is smarter than you today.",
    "Don't worry, I've seen worse. Not much worse, but worse.",
    "Maybe take a sip of coffee and try again?",
    "Your keyboard is rooting for you. Your terminal is not.",
    "A for effort, F for execution.",
    "This is what we call a 'growth opportunity'.",
    "The error is temporary. Your confusion might not be.",
    "That command was an interesting choice. Wrong, but interesting.",
    "You miss 100% of the commands you mistype.",
    "It's not a bug, it's a you problem.",
    "Have you tried turning yourself off and on again?",
    "Remember: every expert was once a beginner. You're very much still beginning.",
    "Google is free, just saying.",
    "Your future self is shaking their head right now.",
    "Keep going! The errors build character.",
  ],

  medium: [
    "Another error? Your code is speedrunning failure.",
    "Your terminal has trust issues because of you.",
    "Bro thinks he's a developer 💀",
    "The compiler just filed a restraining order against you.",
    "Do you even code, bro?",
    "That error message has been seen more times than your GitHub profile.",
    "Your code quality is an unpaid intern's nightmare.",
    "Even Copilot couldn't save that disaster.",
    "Are you writing code or generating modern art with errors?",
    "Stack Overflow: 'Not even we can help you.'",
    "Your terminal is running, but from YOUR code.",
    "If errors were dollars, you'd be a billionaire.",
    "Congrats, you just invented a new way to fail!",
    "Delete system32 — it'd be an improvement at this point.",
    "Maybe coding isn't your calling. Have you tried cooking?",
    "Your code runs... away from you.",
    "You just made your debugger cry.",
    "Is this code or a cry for help?",
    "I've seen better logic in a TikTok comment section.",
    "The only thing your code is compiling is disappointment.",
    "Your keyboard should file for worker's compensation.",
    "That was so wrong, even ChatGPT would refuse to explain it.",
    "Are you pair programming with a blindfolded monkey?",
    "Error: talent.exe not found.",
    "Your code has more red lines than a teacher's grading sheet.",
    "Fun fact: that error could've been avoided by literally anyone else.",
    "The linter didn't catch that because it gave up on you.",
    "Your commits should require a content warning.",
    "You're not debugging — you're just adding more bugs.",
    "I'd say read the docs, but we both know you won't.",
  ],

  savage: [
    "You call yourself a developer? The audacity.",
    "Uninstall VS Code. You don't deserve it.",
    "If your code was a resume, you'd be unemployable.",
    "I've seen better code written by cats walking on keyboards.",
    "Your GitHub contributions should be classified as war crimes.",
    "The only 10x about you is 10x the bugs.",
    "Your code is so bad it made JavaScript look well-designed.",
    "NASA would reject you — not for space, for the cafeteria.",
    "You're the reason companies have code reviews.",
    "Even your console.log doesn't want to talk to you.",
    "Your code is proof that AI should replace some developers.",
    "You're not a developer, you're a Stack Overflow cover band.",
    "The terminal isn't broken. You are.",
    "Retirement seems like a solid career move for you.",
    "Your code is what happens when tutorials skip error handling.",
    "If incompetence was a framework, you'd be its creator.",
    "I've seen cleaner code in a YouTube tutorial from 2014.",
    "Your repo should be private. For humanity's sake.",
    "You didn't just write bad code. You wrote offensive code.",
    "Darwin's theory doesn't apply to your code — nothing's evolving.",
    "Your code makes PHP look elegant.",
    "The only merge your code deserves is with the trash.",
    "You're not writing bugs, you're farming them.",
    "Your code is the software equivalent of a dumpster fire.",
    "Every line you write is a crime against computing.",
    "You're the reason we can't have nice things in production.",
    "Your code should be studied — as a cautionary tale.",
    "The terminal wants to unionize because of you.",
    "Alt+F4 yourself out of this profession.",
    "Your code doesn't need comments, it needs a funeral.",
  ],

  desi: [
    "Beta, tumse na ho payega. 😭",
    "Sharma ji ka beta toh pehli baar mein code chala deta.",
    "Arre bhai bhai bhai! Ye kya likh diya? 😂",
    "Log kya kahenge? 'Ye developer hai?' 💀",
    "Padhai likhai ka koi fayda nahi hua tereko.",
    "Tu developer hai ya pani puri wala? Code toh dono nahi bana sakte.",
    "Ye code dekh ke mummy bolegi — 'Doctor banna tha na tujhe.'",
    "Beta, UPSC ki tayyari kar lo. Coding chhod do.",
    "Tera code dekh ke Infosys bhi reject kar degi.",
    "Bhai, ctrl+z kar aur ghar ja.",
    "Chappal se marunga — ye kya code hai?! 🩴",
    "Tera code Ramayana se bhi lamba aur useless hai.",
    "Papa ko mat dikhana ye code. Dukaan pe bitha denge.",
    "IIT se reject hoke bhi isse achha code likhte hain log.",
    "Tu wahi hai na jo 'Hello World' mein bhi bug daal de?",
    "Tera code dekh ke mera mann kiya mai khud resign kar du.",
    "Chacha Vidhayak hai kya tere? Code bina bug ke nahi chalega?",
    "Beta, chai la — coding tere bas ki nahi hai. ☕",
    "Ye code hai ya Jio ka network? Kuch kaam nahi karta.",
    "Stack Overflow pe bhi tera question downvote hoga.",
    "Bhai tu Jugaad developer hai — kuch kaam nahi karta, phir bhi survive karta hai.",
    "Arre yaar, ye error hai ya tera daily routine?",
    "Engineering ki degree waste ho gayi teri toh.",
    "Mummy se boldu? 'Beta code nahi likh pa raha.' 📞",
    "Tu coding chhod de, chai ki tapri khol — zyada kamayega.",
    "Tere code mein bug nahi, bug mein tera code hai.",
    "Tera code dekh ke recruiter ne LinkedIn delete kar diya.",
    "Placement cell ne tujhe blacklist kar diya hai shayad.",
    "Chal bhai, freelancer ban ja — waha bhi nahi chalega tu.",
    "Tera code dekh ke AI ne khud ko shutdown kar liya. 🤖",
  ],
};

export class RoastBankProvider {
  private recentRoasts: string[] = [];
  private maxRecent = 15;

  getRoast(level: RoastLevel): string {
    const roasts = ROAST_BANK[level];
    // Avoid repeats
    const available = roasts.filter(r => !this.recentRoasts.includes(r));
    const pool = available.length > 0 ? available : roasts;

    const roast = pool[Math.floor(Math.random() * pool.length)];

    this.recentRoasts.push(roast);
    if (this.recentRoasts.length > this.maxRecent) {
      this.recentRoasts.shift();
    }

    return roast;
  }
}
