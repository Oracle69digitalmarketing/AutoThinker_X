import { Blueprint } from '../../../types';
import { BaseGenerator, ExportOptions } from './BaseGenerator';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export class MarketingPlaybookGenerator extends BaseGenerator {
  async generate(blueprint: Blueprint, options?: ExportOptions): Promise<Blob> {
    const doc = new jsPDF();
    const color = this.getBrandingColor(blueprint.branding);
    
    doc.setFillColor(color);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('MARKETING PLAYBOOK', 15, 25);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('GTM Strategy', 15, 55);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(blueprint.marketing.gtm_strategy, 180), 15, 65);
    
    autoTable(doc, {
      startY: 90,
      head: [['Channel', 'Strategy']],
      body: blueprint.marketing.social_content.map(content => ['Social Content', content]),
      headStyles: { fillColor: color }
    });
    
    return doc.output('blob');
  }
}
