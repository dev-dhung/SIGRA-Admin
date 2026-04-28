import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn<T> {
  header: string;
  field: (row: T) => string | number;
}

@Injectable({ providedIn: 'root' })
export class ExportacionService {
  exportarCSV<T>(filename: string, columns: ExportColumn<T>[], rows: T[]) {
    const escape = (val: string | number) => {
      const s = String(val ?? '');
      return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      columns.map(c => escape(c.header)).join(','),
      ...rows.map(r => columns.map(c => escape(c.field(r))).join(',')),
    ];
    const csv = '﻿' + lines.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  exportarExcel<T>(filename: string, sheetName: string, columns: ExportColumn<T>[], rows: T[]) {
    const headers = columns.map(c => c.header);
    const data = rows.map(r => columns.map(c => c.field(r)));
    const aoa = [headers, ...data];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = columns.map(c => ({ wch: Math.max(c.header.length + 4, 18) }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  exportarPDF<T>(filename: string, titulo: string, columns: ExportColumn<T>[], rows: T[]) {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt' });

    doc.setFontSize(16);
    doc.text('SIGRA - Sistema de Gestión de Residencias', 40, 40);
    doc.setFontSize(12);
    doc.text(titulo, 40, 60);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Generado: ${new Date().toLocaleString('es-VE')}`, 40, 76);
    doc.setTextColor(0);

    autoTable(doc, {
      startY: 90,
      head: [columns.map(c => c.header)],
      body: rows.map(r => columns.map(c => String(c.field(r)))),
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [70, 95, 255], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`${filename}.pdf`);
  }
}
