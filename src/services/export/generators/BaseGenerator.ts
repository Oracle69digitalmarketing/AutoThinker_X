import { Blueprint } from '../../../types';

export interface ExportOptions {
  filename?: string;
  branding?: any;
}

export abstract class BaseGenerator {
  abstract generate(blueprint: Blueprint, options?: ExportOptions): Promise<Blob>;
  
  protected getBrandingColor(brandingType?: string): string {
    switch (brandingType) {
      case 'corporate-clean': return '#1e293b'; // slate-800
      case 'playful-modern': return '#6366f1'; // indigo-500
      case 'tech-bold': 
      default: return '#4f46e5'; // indigo-600
    }
  }
}
