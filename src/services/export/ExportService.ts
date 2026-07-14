import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Blueprint } from '../../types';
import { BusinessPlanGenerator } from './generators/BusinessPlanGenerator';
import { ExecutiveSummaryGenerator } from './generators/ExecutiveSummaryGenerator';
import { PitchDeckGenerator } from './generators/PitchDeckGenerator';
import { FinancialModelGenerator } from './generators/FinancialModelGenerator';
import { MarketingPlaybookGenerator } from './generators/MarketingPlaybookGenerator';
import { TechnicalArchitectureGenerator } from './generators/TechnicalArchitectureGenerator';

export type ExportType = 'business-plan' | 'executive-summary' | 'pitch-deck' | 'financial-model' | 'marketing-playbook' | 'technical-architecture' | 'all-assets';

export class ExportService {
  private static generators = {
    'business-plan': new BusinessPlanGenerator(),
    'executive-summary': new ExecutiveSummaryGenerator(),
    'pitch-deck': new PitchDeckGenerator(),
    'financial-model': new FinancialModelGenerator(),
    'marketing-playbook': new MarketingPlaybookGenerator(),
    'technical-architecture': new TechnicalArchitectureGenerator(),
  };

  static async generate(type: ExportType, blueprint: Blueprint): Promise<void> {
    const filename = blueprint.name.replace(/\s+/g, '_').toLowerCase();

    if (type === 'all-assets') {
      await this.generateZip(blueprint, filename);
      return;
    }

    const generator = this.generators[type as keyof typeof this.generators];
    if (!generator) throw new Error(`Unknown export type: ${type}`);

    const blob = await generator.generate(blueprint);
    const extension = this.getExtension(type);
    saveAs(blob, `${filename}_${type}.${extension}`);
  }

  private static async generateZip(blueprint: Blueprint, filename: string): Promise<void> {
    const zip = new JSZip();
    
    for (const [type, generator] of Object.entries(this.generators)) {
      const blob = await generator.generate(blueprint);
      const extension = this.getExtension(type as ExportType);
      zip.file(`${filename}_${type}.${extension}`, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${filename}_full_venture_assets.zip`);
  }

  private static getExtension(type: ExportType): string {
    switch (type) {
      case 'business-plan': return 'docx';
      case 'executive-summary': 
      case 'marketing-playbook':
      case 'technical-architecture': return 'pdf';
      case 'pitch-deck': return 'pptx';
      case 'financial-model': return 'xlsx';
      default: return 'bin';
    }
  }
}
