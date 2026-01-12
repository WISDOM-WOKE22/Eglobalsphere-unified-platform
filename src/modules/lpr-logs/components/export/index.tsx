import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from "xlsx";
import { LPRLog } from '@/types';

interface LPRLogExportData {
  id: string;
  license_plate: string;
  vehicle_owner: string;
  gate: string;
  date: string;
  gate_access_type: string;
  time: string;
  authorization_status: string;
}

export const exportLPRLogs = (format: 'csv' | 'pdf' | 'excel', currentData: LPRLog[]) => {
  try {
    const logs = currentData;
    const fileName = 'lpr_access_logs';

    if (format === 'excel') {
      const columnMappings: Record<keyof LPRLogExportData, string> = {
        id: "Log ID",
        license_plate: "License Plate",
        vehicle_owner: "Vehicle Owner",
        gate: "Gate",
        date: "Date",
        time: "Time",
        gate_access_type: "Access Type",
        authorization_status: "Authorization",
      };

      // Convert data to match custom headers
      const formattedData = logs.map((item: LPRLog) => ({
        "Log ID": item.id,
        "License Plate": item.license_plate,
        "Vehicle Owner": item.vehicle_owner,
        "Gate": item.gate,
        "Date": item.date,
        "Time": item.time,
        "Access Type": item.gate_access_type,
        "Authorization": item.authorization_status,
      }));

      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData, {
        header: Object.values(columnMappings),
      });

      // Set column widths
      const columnWidths = [
        { wch: 25 }, // Log ID
        { wch: 18 }, // License Plate
        { wch: 25 }, // Vehicle Owner
        { wch: 15 }, // Gate
        { wch: 15 }, // Date
        { wch: 12 }, // Time
        { wch: 18 }, // Access Type
        { wch: 18 }, // Authorization
      ];
      ws["!cols"] = columnWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "LPR Access Logs");

      // Generate and save Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(dataBlob, `${fileName}.xlsx`);

    } else if (format === 'csv') {
      // Format data for CSV
      const csvData = logs.map((item: LPRLog) => ({
        "Log ID": item.id,
        "License Plate": item.license_plate,
        "Vehicle Owner": item.vehicle_owner,
        "Gate": item.gate,
        "Date": item.date,
        "Time": item.time,
        "Access Type": item.gate_access_type,
        "Authorization": item.authorization_status,
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
        license_plate: 'License Plate',
        vehicle_owner: 'Vehicle Owner',
        gate: 'Gate',
        date: 'Date',
        time: 'Time',
        gate_access_type: 'Access Type',
        authorization_status: 'Authorization',
      };

      const importantColumns = Object.keys(columnMappings);
      const tableColumn = importantColumns.map((key) => columnMappings[key]);
      const tableRows = logs.map((log) =>
        importantColumns.map((col) => {
          return log[col as keyof LPRLog] || '';
        })
      );

      doc.text('LPR Gate Access Logs', 14, 30);
      
      // Add summary info
      doc.setFontSize(10);
      doc.text(`Total Records: ${logs.length}`, 14, 40);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 46);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        styles: { fontSize: 8, cellPadding: 2, minCellHeight: 10 },
        headStyles: { fillColor: '#03AF69' },
        columnStyles: {
          0: { cellWidth: 35 }, // License Plate
          1: { cellWidth: 40 }, // Vehicle Owner
          2: { cellWidth: 30 }, // Gate
          3: { cellWidth: 30 }, // Date
          4: { cellWidth: 25 }, // Time
          5: { cellWidth: 35 }, // Access Type
          6: { cellWidth: 35 }, // Authorization
        },
      });
      doc.save(`${fileName}.pdf`);
    }

    toast.success(`LPR logs exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Error exporting LPR logs'
    );
  }
};

