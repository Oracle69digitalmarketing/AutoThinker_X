import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Header, Footer } from 'docx';
import { Blueprint } from '../../../types';
import { BaseGenerator, ExportOptions } from './BaseGenerator';

export class BusinessPlanGenerator extends BaseGenerator {
  async generate(blueprint: Blueprint, options?: ExportOptions): Promise<Blob> {
    const doc = new Document({
      sections: [{
        properties: {},
        headers: {
          default: new Header({
            children: [new Paragraph({
              children: [new TextRun({ text: blueprint.name, bold: true })],
              alignment: AlignmentType.RIGHT,
            })],
          }),
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({
              children: [new TextRun({ text: "Confidential - AutoThinker X Venture OS" })],
              alignment: AlignmentType.CENTER,
            })],
          }),
        },
        children: [
          new Paragraph({
            text: blueprint.name,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: blueprint.tagline,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "", spacing: { before: 400 } }),
          new Paragraph({
            children: [new TextRun({ text: "1. Executive Summary", bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [new TextRun(blueprint.pitch)],
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "2. Market Analysis", bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [new TextRun(`TAM: ${blueprint.market.tam}`)],
          }),
          new Paragraph({
            children: [new TextRun(`SAM: ${blueprint.market.sam}`)],
          }),
          new Paragraph({
            children: [new TextRun(`SOM: ${blueprint.market.som}`)],
          }),
        ],
      }],
    });

    return await Packer.toBlob(doc);
  }
}
