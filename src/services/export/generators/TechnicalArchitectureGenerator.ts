import { Blueprint } from '../../../types';
import { BaseGenerator, ExportOptions } from './BaseGenerator';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export class TechnicalArchitectureGenerator extends BaseGenerator {
  async generate(blueprint: Blueprint, options?: ExportOptions): Promise<Blob> {
    const doc = new jsPDF();
    const color = this.getBrandingColor(blueprint.branding);
    
    doc.setFillColor(color);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('TECHNICAL ARCHITECTURE', 15, 25);
    
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
      startY: 55,
      head: [['Layer', 'Technology']],
      body: [
        ['Frontend', blueprint.technology.frontend],
        ['Backend', blueprint.technology.backend],
        ['Database', blueprint.technology.database],
        ['AI Stack', blueprint.technology.ai_stack],
        ['Deployment', blueprint.technology.deployment],
      ],
      headStyles: { fillColor: color }
    });
    
    return doc.output('blob');
  }
}
