import { isObject, isString, isFinite } from 'lodash';
import dayjs from 'dayjs';
import ExcelJS, { type Column, type Cell, type Workbook } from 'exceljs';
import type { Context } from '@midwayjs/koa';

interface generateSheetOptions {
  sheetName?: string;
  title: { text: string; subText?: string };
  columns: Partial<Column>[];
  source: any[];
  options: {
    setCellOptions?: (cell: Cell, colNumber: number) => void;
  };
}

export const getCellContent = (cell: Cell) => {
  const value = cell.value;
  switch (true) {
    case isString(value):
      return value.trim();
    case isObject(value):
      return value?.['result'];
    case isFinite(value):
      return value;
    default:
      return undefined;
  }
};

export const generateExcel = (
  columns: Partial<Column>[],
  title: { text: string; subText?: string },
  source: any[],
  options: {
    setCellOptions?: (cell: Cell, colNumber: number) => void;
  } = {}
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');
  sheet.columns = columns.map(item => {
    const header = typeof item === 'object' ? item.header || '' : item;
    return {
      header: header,
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
      width: 30,
      ...(isObject(item) ? item : null),
    };
  });
  sheet.insertRow(0, null);
  const titleCell = sheet.getCell('A1');
  titleCell.value = {
    richText: [
      {
        font: {
          size: 16,
          bold: true,
          color: { argb: 'FF000000' },
          name: 'Arial',
          family: 2,
          scheme: 'minor',
        },
        text: title?.text || '',
      },
      {
        font: {
          size: 12,
          color: { argb: 'FF000000' },
          name: 'Arial',
          family: 2,
          scheme: 'minor',
        },
        text: `  ${title?.subText || ''}`,
      },
    ],
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  const row = sheet.getRow(1);
  row.height = 40;
  // 合并 按开始行，开始列，结束行，结束列合并（相当于 K10:M12）
  sheet.mergeCells(1, 1, 1, sheet.columns.length);
  // 设置第二行样式内容
  const headRow = sheet.getRow(2);
  headRow.eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF808080' },
    };
    cell.font = {
      size: 10,
      bold: true,
      name: 'Arial',
      color: { argb: 'FFFFFFFF' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } },
    };
  });

  source.forEach(data => {
    const row = sheet.addRow(data);
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left',
      };
      cell.font = { size: 10, name: 'Arial', color: { argb: 'FF000000' } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
      options.setCellOptions?.(cell, colNumber);
    });
  });

  return workbook;
};

export const generateAdvancedExcel = (sheets: generateSheetOptions[]) => {
  const workbook = new ExcelJS.Workbook();
  sheets.forEach(sheet => {
    generateSheet(workbook, sheet);
  });
  return workbook;
};

export const generateSheet = (
  workbook: Workbook,
  sheetOptions: generateSheetOptions
) => {
  const { sheetName, columns, title, options, source } = sheetOptions;
  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = columns.map(item => {
    const header = typeof item === 'object' ? item.header || '' : item;
    return {
      header: header,
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
      width: 30,
      ...(isObject(item) ? item : null),
    };
  });
  sheet.insertRow(0, null);
  const titleCell = sheet.getCell('A1');
  titleCell.value = {
    richText: [
      {
        font: {
          size: 16,
          bold: true,
          color: { argb: 'FF000000' },
          name: 'Arial',
          family: 2,
          scheme: 'minor',
        },
        text: title?.text || '',
      },
      {
        font: {
          size: 12,
          color: { argb: 'FF000000' },
          name: 'Arial',
          family: 2,
          scheme: 'minor',
        },
        text: `  ${title?.subText || ''}`,
      },
    ],
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  const row = sheet.getRow(1);
  row.height = 40;
  // 合并 按开始行，开始列，结束行，结束列合并（相当于 K10:M12）
  sheet.mergeCells(1, 1, 1, sheet.columns.length);
  // 设置第二行样式内容
  const headRow = sheet.getRow(2);
  headRow.eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF808080' },
    };
    cell.font = {
      size: 10,
      bold: true,
      name: 'Arial',
      color: { argb: 'FFFFFFFF' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } },
    };
  });

  source.forEach(data => {
    const row = sheet.addRow(data);
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left',
      };
      cell.font = { size: 10, name: 'Arial', color: { argb: 'FF000000' } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
      options.setCellOptions?.(cell, colNumber);
    });
  });
};

export const exportAsExcel = async (
  ctx: Context,
  fileName: string,
  workbook: Workbook
) => {
  ctx.set(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  ctx.set(
    'Content-Disposition',
    `attachment; filename=${encodeURIComponent(fileName)}-${dayjs().format(
      'YYYYMMDDHHmmss'
    )}.xlsx`
  );
  ctx.status = 200;
  await workbook.xlsx.write(ctx.res);
  ctx.res.end();
};
