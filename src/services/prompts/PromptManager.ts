import { PromptLoader, LoadedPrompt } from './PromptLoader';

export class PromptManager {
  private static cache: Map<string, LoadedPrompt> = new Map();
  private static isDev = process.env.NODE_ENV !== 'production';

  /**
   * Retrieves a prompt by name, with caching support.
   * In development, it reloads the prompt from disk every time.
   */
  static async getPrompt(name: string): Promise<LoadedPrompt> {
    if (!this.isDev && this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    const prompt = await PromptLoader.loadPrompt(name);
    
    // Validate the prompt structure
    this.validatePrompt(prompt);

    if (!this.isDev) {
      this.cache.set(name, prompt);
    }

    return prompt;
  }

  /**
   * Validates that a prompt contains required architectural sections.
   */
  private static validatePrompt(prompt: LoadedPrompt): void {
    const requiredSections = [
      'Role',
      'Objective',
      'Responsibilities',
      'Output requirements',
      'Quality standards',
      'Formatting rules',
      'JSON schema',
      'Failure handling'
    ];

    const missingSections = requiredSections.filter(
      section => !prompt.content.toLowerCase().includes(`## ${section.toLowerCase()}`)
    );

    if (missingSections.length > 0) {
      console.warn(
        `[PromptManager] Warning: Prompt "${prompt.name}" (v${prompt.metadata.version}) is missing sections: ${missingSections.join(', ')}`
      );
    }
  }

  /**
   * Clears the prompt cache.
   */
  static clearCache(): void {
    this.cache.clear();
    console.log('[PromptManager] Cache cleared.');
  }

  /**
   * Batch load prompts into cache.
   */
  static async preloadPrompts(names: string[]): Promise<void> {
    await Promise.all(names.map(name => this.getPrompt(name)));
    console.log(`[PromptManager] Preloaded ${names.length} prompts.`);
  }

  /**
   * Returns metadata for all cached prompts.
   */
  static getAllMetadata(): Record<string, any> {
    const metadata: Record<string, any> = {};
    this.cache.forEach((prompt, name) => {
      metadata[name] = prompt.metadata;
    });
    return metadata;
  }
}
