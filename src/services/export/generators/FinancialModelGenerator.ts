import ExcelJS from 'exceljs';
import { Blueprint } from '../../../types';
import { BaseGenerator, ExportOptions } from './BaseGenerator';

export class FinancialModelGenerator extends BaseGenerator {
  async generate(blueprint: Blueprint, options?: ExportOptions): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'AutoThinker X';
    workbook.lastModifiedBy = 'AutoThinker X';
    workbook.created = new Date();
    workbook.modified = new Date();

    // 1. Summary Sheet
    const summarySheet = workbook.addWorksheet('Venture Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 50 },
    ];
    summarySheet.addRow({ metric: 'Venture Name', value: blueprint.name });
    summarySheet.addRow({ metric: 'TAM', value: blueprint.market.tam });
    summarySheet.addRow({ metric: 'SAM', value: blueprint.market.sam });
    summarySheet.addRow({ metric: 'SOM', value: blueprint.market.som });
    summarySheet.addRow({ metric: 'Pricing Model', value: blueprint.finance.pricing });

    // 2. Revenue Projections
    const revSheet = workbook.addWorksheet('Revenue Projections');
    revSheet.columns = [
      { header: 'Item', key: 'item', width: 25 },
      { header: 'Month 1', key: 'm1', width: 15 },
      { header: 'Month 2', key: 'm2', width: 15 },
      { header: 'Month 3', key: 'm3', width: 15 },
      { header: 'Year 1 Total', key: 'y1', width: 20 },
    ];

    revSheet.addRow({ item: 'Projected Customers', m1: 100, m2: 250, m3: 500 });
    revSheet.addRow({ item: 'Revenue Per User ($)', m1: 20, m2: 20, m3: 20 });
    
    // Add Formulas
    const totalRow = revSheet.addRow({ item: 'Total Revenue ($)' });
    totalRow.getCell(2).value = { formula: 'B2*B3' };
    totalRow.getCell(3).value = { formula: 'C2*C3' };
    totalRow.getCell(4).value = { formula: 'D2*D3' };
    totalRow.getCell(5).value = { formula: 'SUM(B4:D4)' };

    // 3. Cost Analysis
    const costSheet = workbook.addWorksheet('Cost Analysis');
    costSheet.addRow(['Expense Category', 'Monthly Cost ($)', 'Yearly Cost ($)']);
    costSheet.addRow(['Cloud Infrastructure', 500, { formula: 'B2*12' }]);
    costSheet.addRow(['Marketing & Sales', 2000, { formula: 'B3*12' }]);
    costSheet.addRow(['Engineering', 15000, { formula: 'B4*12' }]);
    costSheet.addRow(['Operations', 1000, { formula: 'B5*12' }]);
    
    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}
