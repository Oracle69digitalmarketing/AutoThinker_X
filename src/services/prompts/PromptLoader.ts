import fs from 'fs/promises';
import path from 'path';

export interface PromptMetadata {
  version: string;
  author: string;
  lastUpdated: string;
  description: string;
}

export interface LoadedPrompt {
  name: string;
  content: string;
  metadata: PromptMetadata;
}

export class PromptLoader {
  private static promptsDir = path.join(process.cwd(), 'prompts');

  /**
   * Loads a prompt from a markdown file in the /prompts directory.
   * Parses frontmatter metadata and the main prompt content.
   */
  static async loadPrompt(name: string): Promise<LoadedPrompt> {
    const fileName = name.endsWith('.md') ? name : `${name}.md`;
    const filePath = path.join(this.promptsDir, fileName);

    try {
      const rawContent = await fs.readFile(filePath, 'utf-8');
      return this.parsePrompt(name, rawContent);
    } catch (error) {
      console.error(`Error loading prompt "${name}":`, error);
      throw new Error(`Failed to load prompt "${name}" from ${filePath}`);
    }
  }

  /**
   * Injects variables into a prompt template using {{variable}} syntax.
   */
  static buildPrompt(template: string, variables: Record<string, any>): string {
    let rendered = template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(placeholder, value !== undefined ? String(value) : '');
    }
    return rendered;
  }

  /**
   * Helper to render a prompt with variables (alias for buildPrompt).
   */
  static renderPrompt(template: string, data: Record<string, any>): string {
    return this.buildPrompt(template, data);
  }

  /**
   * Internal parser for markdown files with YAML-like frontmatter.
   */
  private static parsePrompt(name: string, rawContent: string): LoadedPrompt {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = rawContent.match(frontmatterRegex);

    if (!match) {
      return {
        name,
        content: rawContent,
        metadata: {
          version: '0.0.0',
          author: 'Unknown',
          lastUpdated: new Date().toISOString(),
          description: 'No metadata found'
        }
      };
    }

    const yamlBlock = match[1];
    const content = match[2];
    const metadata: any = {};

    yamlBlock.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        metadata[key.trim()] = valueParts.join(':').trim();
      }
    });

    return {
      name,
      content: content.trim(),
      metadata: {
        version: metadata.version || '1.0.0',
        author: metadata.author || 'AutoThinker X',
        lastUpdated: metadata.last_updated || metadata.lastUpdated || '',
        description: metadata.description || ''
      }
    };
  }
}
