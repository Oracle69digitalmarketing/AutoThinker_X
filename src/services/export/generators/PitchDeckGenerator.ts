import pptxgen from 'pptxgenjs';
import { Blueprint } from '../../../types';
import { BaseGenerator, ExportOptions } from './BaseGenerator';

export class PitchDeckGenerator extends BaseGenerator {
  async generate(blueprint: Blueprint, options?: ExportOptions): Promise<Blob> {
    const pptx = new pptxgen();
    const color = this.getBrandingColor(blueprint.branding).replace('#', '');
    
    pptx.layout = 'LAYOUT_WIDE';
    pptx.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: 'FFFFFF' },
      objects: [
        { rect: { x: 0, y: 0, w: '100%', h: 0.8, fill: { color: color } } },
        { text: { text: blueprint.name, options: { x: 0.5, y: 0.2, color: 'FFFFFF', fontSize: 24, bold: true } } },
        { line: { x: 0.5, y: 6.8, w: 12.3, h: 0, line: { color: color, width: 1 } } },
        { text: { text: 'AutoThinker X Venture OS', options: { x: 0.5, y: 6.9, color: '999999', fontSize: 10 } } }
      ]
    });

    // 1. Title Slide
    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: '0f172a' };
    titleSlide.addText(blueprint.name.toUpperCase(), { x: 1, y: 2.5, w: '80%', fontSize: 56, bold: true, color: 'FFFFFF', align: 'center' });
    titleSlide.addText(blueprint.tagline, { x: 1, y: 3.5, w: '80%', fontSize: 24, color: color, align: 'center' });
    titleSlide.addText('PITCH DECK', { x: 1, y: 6, w: '80%', fontSize: 14, color: 'FFFFFF', align: 'center', bold: true });

    // 2. The Problem
    const probSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    probSlide.addText('THE PROBLEM', { x: 0.5, y: 1.2, fontSize: 36, bold: true, color: color });
    probSlide.addText(blueprint.overview.problem, { x: 0.5, y: 2.5, w: 12, fontSize: 22, color: '333333' });

    // 3. The Solution
    const solSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    solSlide.addText('OUR SOLUTION', { x: 0.5, y: 1.2, fontSize: 36, bold: true, color: color });
    solSlide.addText(blueprint.overview.solution, { x: 0.5, y: 2.5, w: 12, fontSize: 22, color: '333333' });

    // 4. Market Size (Chart Simulation)
    const marketSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    marketSlide.addText('MARKET POTENTIAL', { x: 0.5, y: 1.2, fontSize: 36, bold: true, color: color });
    
    const dataChartArea = [
      { name: 'TAM', labels: ['Market'], values: [100] },
      { name: 'SAM', labels: ['Market'], values: [65] },
      { name: 'SOM', labels: ['Market'], values: [15] }
    ];
    
    marketSlide.addChart(pptx.ChartType.bar, dataChartArea, { x: 0.5, y: 2, w: 6, h: 4 });
    marketSlide.addText(`TAM: ${blueprint.market.tam}\nSAM: ${blueprint.market.sam}\nSOM: ${blueprint.market.som}`, { x: 7, y: 2.5, w: 5, fontSize: 20, color: '666666' });

    // 5. Business Model
    const bizSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    bizSlide.addText('BUSINESS MODEL', { x: 0.5, y: 1.2, fontSize: 36, bold: true, color: color });
    bizSlide.addText(blueprint.overview.business_model, { x: 0.5, y: 2.5, w: 12, fontSize: 22, color: '333333' });

    // 6. Technology
    const techSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    techSlide.addText('TECHNOLOGY STACK', { x: 0.5, y: 1.2, fontSize: 36, bold: true, color: color });
    techSlide.addText([
      { text: 'Frontend: ', options: { bold: true } }, { text: blueprint.technology.frontend },
      { text: '\nBackend: ', options: { bold: true } }, { text: blueprint.technology.backend },
      { text: '\nDatabase: ', options: { bold: true } }, { text: blueprint.technology.database },
      { text: '\nInfrastructure: ', options: { bold: true } }, { text: blueprint.technology.deployment }
    ], { x: 0.5, y: 2.5, w: 12, fontSize: 18, color: '333333' });

    const blob = await pptx.write({ outputType: 'blob' }) as Blob;
    return blob;
  }
}
