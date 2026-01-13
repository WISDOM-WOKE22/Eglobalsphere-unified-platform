import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from "xlsx";
import moment from 'moment';
import { SpherexLog } from '@/types';

interface SpherexLogExportData {
  id: string;
  log_type: string;
  license_plate: string;
  authorized: boolean;
  status: string;
  time: string;
}

export const exportSpherexLogs = (format: 'csv' | 'pdf' | 'excel', currentData: SpherexLog[]) => {
  try {
    const logs = currentData;
    const fileName = 'spherex_logs';

    if (format === 'excel') {
      const columnMappings: Record<keyof SpherexLogExportData, string> = {
        id: "Log ID",
        log_type: "Log Type",
        license_plate: "License Plate",
        authorized: "Authorized",
        status: "Status",
        time: "Time",
      };

      // Convert data to match custom headers
      const formattedData = logs.map((item: SpherexLog) => ({
        "Log ID": item.id,
        "Log Type": item.log_type,
        "License Plate": item.license_plate,
        "Authorized": item.authorized ? "Yes" : "No",
        "Status": item.status,
        "Time": moment(item.time).format("DD MMM YYYY HH:mm:ss"),
      }));

      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData, {
        header: Object.values(columnMappings),
      });

      // Set column widths
      const columnWidths = [
        { wch: 30 }, // Log ID
        { wch: 15 }, // Log Type
        { wch: 20 }, // License Plate
        { wch: 12 }, // Authorized
        { wch: 15 }, // Status
        { wch: 20 }, // Time
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
      const csvData = logs.map((item: SpherexLog) => ({
        "Log ID": item.id,
        "Log Type": item.log_type,
        "License Plate": item.license_plate,
        "Authorized": item.authorized ? "Yes" : "No",
        "Status": item.status,
        "Time": moment(item.time).format("DD MMM YYYY HH:mm:ss"),
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
        id: 'Log ID',
        log_type: 'Log Type',
        license_plate: 'License Plate',
        authorized: 'Authorized',
        status: 'Status',
        time: 'Time',
      };

      const importantColumns = Object.keys(columnMappings);
      const tableColumn = importantColumns.map((key) => columnMappings[key]);
      const tableRows = logs.map((log) =>
        importantColumns.map((col) => {
          if (col === 'authorized') {
            return log.authorized ? 'Yes' : 'No';
          }
          if (col === 'time') {
            return moment(log.time).format("DD MMM YYYY HH:mm");
          }
          return log[col as keyof SpherexLog] || '';
        })
      );

      doc.text('SphereX Access Logs', 14, 30);
      
      // Add summary info
      doc.setFontSize(10);
      doc.text(`Total Logs: ${logs.length}`, 14, 40);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 46);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        styles: { fontSize: 8, cellPadding: 2, minCellHeight: 10 },
        headStyles: { fillColor: '#03AF69' },
        columnStyles: {
          0: { cellWidth: 40 }, // Log ID
          1: { cellWidth: 30 }, // Log Type
          2: { cellWidth: 35 }, // License Plate
          3: { cellWidth: 25 }, // Authorized
          4: { cellWidth: 30 }, // Status
          5: { cellWidth: 35 }, // Time
        },
      });
      doc.save(`${fileName}.pdf`);
    }

    toast.success(`SphereX logs exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Error exporting SphereX logs'
    );
  }
};

