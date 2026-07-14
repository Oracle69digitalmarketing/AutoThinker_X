import ExcelJS from 'exceljs';
import { Blueprint } from '../../../types';
import { BaseGenerator, ExportOptions } from './BaseGenerator';

export class FinancialModelGenerator extends BaseGenerator {
  async generate(blueprint: Blueprint, options?: ExportOptions): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    
    // Revenue Worksheet
    const revSheet = workbook.addWorksheet('Revenue Model');
    revSheet.columns = [
      { header: 'Revenue Stream', key: 'stream', width: 30 },
      { header: 'Projected Year 1', key: 'y1', width: 20 },
    ];
    
    blueprint.finance.revenue_streams.forEach(stream => {
      revSheet.addRow({ stream, y1: 100000 });
    });
    
    // Summary Worksheet
    const summarySheet = workbook.addWorksheet('P&L Summary');
    summarySheet.addRow(['Pricing Strategy', blueprint.finance.pricing]);
    summarySheet.addRow(['Cost Structure', blueprint.finance.cost_structure]);
    
    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}
