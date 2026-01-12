import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from "xlsx";

interface SpherexLogData {
  ID: string;
  fullname: string;
  department: string;
  zone: string;
  note: string;
  timestamp: string;
  type: string;
  activity: string;
}

export const exportSpherexLogs = (format: 'csv' | 'pdf' | 'excel', currentData: ReadonlyArray<SpherexLogData>) => {
  try {
    const logs = currentData;
    const fileName = 'spherex_logs';

    if (format === 'excel') {
      const columnMappings: Record<keyof SpherexLogData, string> = {
        ID: "Employee ID",
        fullname: "Full Name",
        department: "Department",
        zone: "Zone",
        type: "Type",
        note: "Note",
        activity: "Activity",
        timestamp: "Timestamp",
      };

      // Convert data to match custom headers
      const formattedData = logs.map((item: SpherexLogData) => ({
        "Employee ID": item.ID,
        "Full Name": item.fullname,
        "Department": item.department,
        "Zone": item.zone,
        "Type": item.type,
        "Note": item.note,
        "Activity": item.activity,
        "Timestamp": item.timestamp,
      }));

      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData, {
        header: Object.values(columnMappings),
      });

      // Set column widths
      const columnWidths = [
        { wch: 15 }, // Employee ID
        { wch: 25 }, // Full Name
        { wch: 20 }, // Department
        { wch: 20 }, // Zone
        { wch: 15 }, // Type
        { wch: 40 }, // Note
        { wch: 15 }, // Activity
        { wch: 20 }, // Timestamp
      ];
      ws["!cols"] = columnWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SphereX Logs");

      // Generate and save Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(dataBlob, `${fileName}.xlsx`);

    } else if (format === 'csv') {
      // Format data for CSV
      const csvData = logs.map((item: SpherexLogData) => ({
        "Employee ID": item.ID,
        "Full Name": item.fullname,
        "Department": item.department,
        "Zone": item.zone,
        "Type": item.type,
        "Note": item.note,
        "Activity": item.activity,
        "Timestamp": item.timestamp,
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}.csv`);
      link.click();
      URL.revokeObjectURL(url);

    } else if (format === 'pdf') {
      const doc = new jsPDF('landscape');
      doc.setFont('helvetica');

      // Add a logo image
      // const logoUrl = '/assets/logos/darkLogo.png';
      // const logoWidth = 60;
      // const logoHeight = 15;
      // doc.addImage(logoUrl, 'PNG', 10, 10, logoWidth, logoHeight);

      const columnMappings: Record<string, string> = {
        ID: 'Employee ID',
        fullname: 'Full Name',
        department: 'Department',
        zone: 'Zone',
        type: 'Type',
        note: 'Note',
        timestamp: 'Timestamp',
      };

      const importantColumns = Object.keys(columnMappings);
      const tableColumn = importantColumns.map((key) => columnMappings[key]);
      const tableRows = logs.map((log) =>
        importantColumns.map((col) => {
          return log[col as keyof SpherexLogData] || '';
        })
      );

      doc.text('SphereX Access Logs', 14, 40);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        styles: { fontSize: 8, cellPadding: 2, minCellHeight: 10 },
        headStyles: { fillColor: '#03AF69' },
        columnStyles: {
          0: { cellWidth: 20 }, // Employee ID
          1: { cellWidth: 35 }, // Full Name
          2: { cellWidth: 30 }, // Department
          3: { cellWidth: 25 }, // Zone
          4: { cellWidth: 20 }, // Type
          5: { cellWidth: 60 }, // Note
          6: { cellWidth: 30 }, // Timestamp
        },
      });
      doc.save(`${fileName}.pdf`);
    }

    toast.success(`Logs exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Error exporting logs'
    );
  }
};

