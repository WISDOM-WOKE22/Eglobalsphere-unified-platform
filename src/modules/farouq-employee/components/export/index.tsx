import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from "xlsx";
import { FarouqLog } from '@/types';
import moment from 'moment';

interface FarouqLogExportData {
  id: string;
  user_name: string;
  log_type: string;
  method: string | null;
  status: string;
  zone: string;
  confidence: string;
  notes: string;
  timestamp: string;
}

// Helper to format method for display
const formatMethod = (method: string | null): string => {
  if (!method || method === 'null') return 'N/A';
  if (method === 'face_recognition') return 'Face Recognition';
  if (method === 'manual') return 'Manual';
  return method;
};

// Helper to format status for display
const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    check_in: 'Check In',
    check_out: 'Check Out',
    present: 'Present',
    absent: 'Absent',
  };
  return statusMap[status] || status;
};

export const exportFarouqLogs = (format: 'csv' | 'pdf' | 'excel', currentData: FarouqLog[]) => {
  try {
    const logs = currentData;
    const fileName = 'farouq_logs';

    if (format === 'excel') {
      const columnMappings: Record<keyof FarouqLogExportData, string> = {
        id: "Log ID",
        user_name: "User Name",
        log_type: "Log Type",
        method: "Method",
        status: "Status",
        zone: "Zone",
        confidence: "Confidence",
        notes: "Notes",
        timestamp: "Timestamp",
      };

      // Convert data to match custom headers
      const formattedData = logs.map((item: FarouqLog) => ({
        "Log ID": item.id,
        "User Name": item.user_name,
        "Log Type": item.log_type,
        "Method": formatMethod(item.method),
        "Status": formatStatus(item.status),
        "Zone": item.zone || "N/A",
        "Confidence": item.confidence || "N/A",
        "Notes": item.notes,
        "Timestamp": moment(item.timestamp).format("DD MMM YYYY HH:mm:ss"),
      }));

      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData, {
        header: Object.values(columnMappings),
      });

      // Set column widths
      const columnWidths = [
        { wch: 30 }, // Log ID
        { wch: 25 }, // User Name
        { wch: 18 }, // Log Type
        { wch: 20 }, // Method
        { wch: 15 }, // Status
        { wch: 15 }, // Zone
        { wch: 15 }, // Confidence
        { wch: 50 }, // Notes
        { wch: 20 }, // Timestamp
      ];
      ws["!cols"] = columnWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Farouq Logs");

      // Generate and save Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(dataBlob, `${fileName}.xlsx`);

    } else if (format === 'csv') {
      // Format data for CSV
      const csvData = logs.map((item: FarouqLog) => ({
        "Log ID": item.id,
        "User Name": item.user_name,
        "Log Type": item.log_type,
        "Method": formatMethod(item.method),
        "Status": formatStatus(item.status),
        "Zone": item.zone || "N/A",
        "Confidence": item.confidence || "N/A",
        "Notes": item.notes,
        "Timestamp": moment(item.timestamp).format("DD MMM YYYY HH:mm:ss"),
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
        user_name: 'User Name',
        log_type: 'Log Type',
        method: 'Method',
        status: 'Status',
        zone: 'Zone',
        confidence: 'Confidence',
        notes: 'Notes',
        timestamp: 'Timestamp',
      };

      const importantColumns = Object.keys(columnMappings);
      const tableColumn = importantColumns.map((key) => columnMappings[key]);
      const tableRows = logs.map((log) =>
        importantColumns.map((col) => {
          if (col === 'method') {
            return formatMethod(log.method);
          }
          if (col === 'status') {
            return formatStatus(log.status);
          }
          if (col === 'timestamp') {
            return moment(log.timestamp).format("DD MMM YYYY HH:mm");
          }
          if (col === 'zone' || col === 'confidence') {
            return log[col as keyof FarouqLog] || 'N/A';
          }
          return log[col as keyof FarouqLog] || '';
        })
      );

      doc.text('Farouq Employee Logs', 14, 30);
      
      // Add summary info
      doc.setFontSize(10);
      doc.text(`Total Logs: ${logs.length}`, 14, 40);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 46);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        styles: { fontSize: 7, cellPadding: 2, minCellHeight: 8 },
        headStyles: { fillColor: '#03AF69' },
        columnStyles: {
          0: { cellWidth: 30 }, // User Name
          1: { cellWidth: 25 }, // Log Type
          2: { cellWidth: 28 }, // Method
          3: { cellWidth: 20 }, // Status
          4: { cellWidth: 18 }, // Zone
          5: { cellWidth: 20 }, // Confidence
          6: { cellWidth: 50 }, // Notes
          7: { cellWidth: 30 }, // Timestamp
        },
      });
      doc.save(`${fileName}.pdf`);
    }

    toast.success(`Farouq logs exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Error exporting Farouq logs'
    );
  }
};

