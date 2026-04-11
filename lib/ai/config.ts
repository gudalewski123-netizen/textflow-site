export interface AIProviderConfig {
  name: string;
  enabled: boolean;
  priority: number;
  apiKeyEnv: string;
}

export const aiProviders: Record<string, AIProviderConfig> = {
  deepseek: {
    name: 'DeepSeek',
    enabled: !!process.env.DEEPSEEK_API_KEY,
    priority: 1,
    apiKeyEnv: 'DEEPSEEK_API_KEY',
  },
  openai: {
    name: 'OpenAI',
    enabled: !!process.env.OPENAI_API_KEY,
    priority: 2,
    apiKeyEnv: 'OPENAI_API_KEY',
  },
  anthropic: {
    name: 'Anthropic',
    enabled: !!process.env.ANTHROPIC_API_KEY,
    priority: 3,
    apiKeyEnv: 'ANTHROPIC_API_KEY',
  },
  groq: {
    name: 'Groq',
    enabled: !!process.env.GROQ_API_KEY,
    priority: 4,
    apiKeyEnv: 'GROQ_API_KEY',
  },
};

export const defaultAIProvider = 'deepseek';

export function getActiveProviders(): AIProviderConfig[] {
  return Object.values(aiProviders)
    .filter(provider => provider.enabled)
    .sort((a, b) => a.priority - b.priority);
}

export function isAIEnabled(): boolean {
  return getActiveProviders().length > 0;
}

export function getBestProvider(): string | null {
  const active = getActiveProviders();
  return active.length > 0 ? Object.keys(aiProviders).find(key => aiProviders[key].name === active[0].name) || null : null;
}

export function getProviderConfig(providerId: string): AIProviderConfig | null {
  return aiProviders[providerId] || null;
}