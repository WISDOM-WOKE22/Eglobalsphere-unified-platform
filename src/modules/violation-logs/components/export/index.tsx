import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from "xlsx";
import { ViolationLog } from '@/types';

interface ViolationLogExportData {
  id: string;
  license_plate: string;
  vehicle_owner: string;
  gate: string;
  violation_date: string;
  violation_type: string;
  violation_time: string;
  is_registered: boolean;
}

export const exportViolationLogs = (format: 'csv' | 'pdf' | 'excel', currentData: ViolationLog[]) => {
  try {
    const violations = currentData;
    const fileName = 'violation_logs';

    if (format === 'excel') {
      const columnMappings: Record<keyof ViolationLogExportData, string> = {
        id: "Violation ID",
        license_plate: "License Plate",
        vehicle_owner: "Vehicle Owner",
        gate: "Gate",
        violation_date: "Date",
        violation_time: "Time",
        violation_type: "Violation Type",
        is_registered: "Registered",
      };

      // Convert data to match custom headers
      const formattedData = violations.map((item: ViolationLog) => ({
        "Violation ID": item.id,
        "License Plate": item.license_plate,
        "Vehicle Owner": item.vehicle_owner,
        "Gate": item.gate,
        "Date": item.violation_date,
        "Time": item.violation_time,
        "Violation Type": item.violation_type,
        "Registered": item.is_registered ? "Yes" : "No",
      }));

      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData, {
        header: Object.values(columnMappings),
      });

      // Set column widths
      const columnWidths = [
        { wch: 30 }, // Violation ID
        { wch: 18 }, // License Plate
        { wch: 25 }, // Vehicle Owner
        { wch: 15 }, // Gate
        { wch: 15 }, // Date
        { wch: 12 }, // Time
        { wch: 20 }, // Violation Type
        { wch: 12 }, // Registered
      ];
      ws["!cols"] = columnWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Violation Logs");

      // Generate and save Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(dataBlob, `${fileName}.xlsx`);

    } else if (format === 'csv') {
      // Format data for CSV
      const csvData = violations.map((item: ViolationLog) => ({
        "Violation ID": item.id,
        "License Plate": item.license_plate,
        "Vehicle Owner": item.vehicle_owner,
        "Gate": item.gate,
        "Date": item.violation_date,
        "Time": item.violation_time,
        "Violation Type": item.violation_type,
        "Registered": item.is_registered ? "Yes" : "No",
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
        violation_date: 'Date',
        violation_time: 'Time',
        violation_type: 'Violation Type',
        is_registered: 'Registered',
      };

      const importantColumns = Object.keys(columnMappings);
      const tableColumn = importantColumns.map((key) => columnMappings[key]);
      const tableRows = violations.map((violation) =>
        importantColumns.map((col) => {
          if (col === 'is_registered') {
            return violation.is_registered ? 'Yes' : 'No';
          }
          return violation[col as keyof ViolationLog] || '';
        })
      );

      doc.text('Vehicle Violation Logs', 14, 30);
      
      // Add summary info
      doc.setFontSize(10);
      doc.text(`Total Violations: ${violations.length}`, 14, 40);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 46);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        styles: { fontSize: 8, cellPadding: 2, minCellHeight: 10 },
        headStyles: { fillColor: '#EF4444' }, // Red color for violations
        columnStyles: {
          0: { cellWidth: 35 }, // License Plate
          1: { cellWidth: 40 }, // Vehicle Owner
          2: { cellWidth: 28 }, // Gate
          3: { cellWidth: 30 }, // Date
          4: { cellWidth: 25 }, // Time
          5: { cellWidth: 40 }, // Violation Type
          6: { cellWidth: 22 }, // Registered
        },
      });
      doc.save(`${fileName}.pdf`);
    }

    toast.success(`Violation logs exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Error exporting violation logs'
    );
  }
};

