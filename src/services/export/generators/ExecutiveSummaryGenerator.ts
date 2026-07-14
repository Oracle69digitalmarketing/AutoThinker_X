import { Blueprint } from '../../../types';
import { BaseGenerator, ExportOptions } from './BaseGenerator';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export class ExecutiveSummaryGenerator extends BaseGenerator {
  async generate(blueprint: Blueprint, options?: ExportOptions): Promise<Blob> {
    const doc = new jsPDF();
    const color = this.getBrandingColor(blueprint.branding);
    
    // Header
    doc.setFillColor(color);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(blueprint.name.toUpperCase(), 15, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(blueprint.tagline, 15, 33);
    
    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('EXECUTIVE SUMMARY', 15, 55);
    
    doc.setDrawColor(color);
    doc.setLineWidth(1);
    doc.line(15, 58, 60, 58);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const splitPitch = doc.splitTextToSize(blueprint.pitch, 180);
    doc.text(splitPitch, 15, 68);
    
    let y = 68 + (splitPitch.length * 7);
    
    // Key Highlights Table
    autoTable(doc, {
      startY: y + 10,
      head: [['Category', 'Details']],
      body: [
        ['Problem', blueprint.overview.problem],
        ['Solution', blueprint.overview.solution],
        ['Market Size (TAM)', blueprint.market.tam],
        ['Business Model', blueprint.overview.business_model],
      ],
      headStyles: { fillColor: color },
      theme: 'striped'
    });
    
    return doc.output('blob');
  }
}
