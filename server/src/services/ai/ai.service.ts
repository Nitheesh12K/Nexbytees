import { NewsDomain } from '@prisma/client';
import { ENV } from '../../config/env';

export interface IAIService {
  summarizeArticle(content: string, maxWords?: number): Promise<string>;
  classifyArticle(title: string, content: string): Promise<NewsDomain>;
  generateTags(title: string, content: string): Promise<string[]>;
  detectDuplicate(title: string, existingTitles: string[]): Promise<{ isDuplicate: boolean; similarity: number }>;
  recommendStories(userInterests: string[], allArticleIds: string[]): Promise<string[]>;
  assistModeration(content: string): Promise<{ isFlagged: boolean; reason?: string }>;
}

export class AIService implements IAIService {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = ENV.AI.PROVIDER !== 'disabled' && (!!ENV.AI.GEMINI_API_KEY || !!ENV.AI.OPENAI_API_KEY);
  }

  async summarizeArticle(content: string, maxWords: number = 60): Promise<string> {
    if (!this.isEnabled) {
      // Fallback: extract first sentences up to maxWords
      const sentences = content.split(/(?<=[.?!])\s+/);
      let summary = '';
      for (const s of sentences) {
        if ((summary + ' ' + s).split(' ').length > maxWords) break;
        summary += (summary ? ' ' : '') + s;
      }
      return summary || content.slice(0, 200) + '...';
    }

    // Future hook for Gemini or OpenAI API call
    return `AI Summary: ${content.slice(0, 180)}...`;
  }

  async classifyArticle(title: string, content: string): Promise<NewsDomain> {
    const text = `${title} ${content}`.toLowerCase();

    if (text.includes('ai') || text.includes('gpt') || text.includes('llm') || text.includes('neural') || text.includes('intelligence')) {
      return NewsDomain.AI;
    }
    if (text.includes('cyber') || text.includes('security') || text.includes('hack') || text.includes('ransomware') || text.includes('malware')) {
      return NewsDomain.CYBERSECURITY;
    }
    if (text.includes('robot') || text.includes('humanoid') || text.includes('bipedal') || text.includes('actuator')) {
      return NewsDomain.ROBOTICS;
    }
    if (text.includes('quantum') || text.includes('qubit') || text.includes('superposition')) {
      return NewsDomain.QUANTUM;
    }
    if (text.includes('space') || text.includes('satellite') || text.includes('orbit') || text.includes('rocket') || text.includes('nasa')) {
      return NewsDomain.SPACE;
    }
    if (text.includes('chip') || text.includes('semiconductor') || text.includes('wafer') || text.includes('gpu') || text.includes('tsmc') || text.includes('nvidia')) {
      return NewsDomain.SEMICONDUCTORS;
    }
    if (text.includes('cloud') || text.includes('aws') || text.includes('azure') || text.includes('kubernetes') || text.includes('serverless')) {
      return NewsDomain.CLOUD;
    }
    if (text.includes('software') || text.includes('code') || text.includes('developer') || text.includes('open source') || text.includes('git')) {
      return NewsDomain.SOFTWARE;
    }
    if (text.includes('startup') || text.includes('venture') || text.includes('funding') || text.includes('unicorn')) {
      return NewsDomain.STARTUPS;
    }
    if (text.includes('phone') || text.includes('smartphone') || text.includes('apple') || text.includes('gadget') || text.includes('headset')) {
      return NewsDomain.GADGETS;
    }

    return NewsDomain.OTHER;
  }

  async generateTags(title: string, content: string): Promise<string[]> {
    const text = `${title} ${content}`.toLowerCase();
    const commonTags = [
      'Artificial Intelligence',
      'Machine Learning',
      'Cybersecurity',
      'Robotics',
      'Quantum',
      'Semiconductors',
      'Cloud Computing',
      'Open Source',
      'Hardware',
      'Software Architecture',
      'Innovation',
      'Future Tech',
    ];

    const matched = commonTags.filter((t) => text.includes(t.toLowerCase()));
    return matched.length > 0 ? matched.slice(0, 5) : ['Technology', 'Breaking'];
  }

  async detectDuplicate(title: string, existingTitles: string[]): Promise<{ isDuplicate: boolean; similarity: number }> {
    const targetArr = title.toLowerCase().split(/\s+/);
    const targetSet = new Set(targetArr);

    for (const existing of existingTitles) {
      const existingArr = existing.toLowerCase().split(/\s+/);
      const existingSet = new Set(existingArr);

      const intersection = targetArr.filter((w) => existingSet.has(w));
      const union = new Set([...targetArr, ...existingArr]);

      const jaccard = intersection.length / union.size;
      if (jaccard > 0.65) {
        return { isDuplicate: true, similarity: Math.round(jaccard * 100) };
      }
    }

    return { isDuplicate: false, similarity: 0 };
  }

  async recommendStories(userInterests: string[], allArticleIds: string[]): Promise<string[]> {
    return allArticleIds.slice(0, 10);
  }

  async assistModeration(content: string): Promise<{ isFlagged: boolean; reason?: string }> {
    const blockedKeywords = ['malicious-exploit-payload', 'hate-speech-sample'];
    const lower = content.toLowerCase();

    for (const word of blockedKeywords) {
      if (lower.includes(word)) {
        return { isFlagged: true, reason: `Contains flagged keyword: ${word}` };
      }
    }
    return { isFlagged: false };
  }
}

export const aiService = new AIService();
