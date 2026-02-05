import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from "xlsx";
import moment from 'moment';
import { Vehicle } from '@/types';
import { renderLicensePlate } from '@/core/commons/utils';

/** UTF-8 BOM so Excel opens CSV with correct encoding (preserves Arabic & Arabic-Indic numerals ٠١٢٣٤٥٦٧٨٩) */
const UTF8_BOM = '\uFEFF';

interface LicensePlateExportRow {
  id: string;
  license_plate: string;
  vehicle_owner: string;
  vehicle_model: string;
  house_no: string;
  status: string;
  date_added: string;
}

export const exportLPRLicensePlates = (format: 'csv' | 'pdf' | 'excel', currentData: Vehicle[]) => {
  try {
    const vehicles = currentData;
    const fileName = 'lpr_license_plates';

    if (format === 'excel') {
      const columnMappings: Record<keyof LicensePlateExportRow, string> = {
        id: "ID",
        license_plate: "License Plate",
        vehicle_owner: "Vehicle Owner",
        vehicle_model: "Vehicle Model",
        house_no: "House No",
        status: "Status",
        date_added: "Date Added",
      };

      // Convert data to match custom headers
      const formattedData = vehicles.map((item: Vehicle) => ({
        "ID": item.id,
        "License Plate": renderLicensePlate(item.license_plate),
        "Vehicle Owner": item.vehicle_owner,
        "Vehicle Model": item.vehicle_model,
        "House No": item.house_no,
        "Status": item.status,
        "Date Added": moment(item.date_added).format("D MMM YYYY HH:mm"),
      }));

      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData, {
        header: Object.values(columnMappings),
      });

      // Set column widths
      const columnWidths = [
        { wch: 28 }, // ID
        { wch: 18 }, // License Plate
        { wch: 22 }, // Vehicle Owner
        { wch: 18 }, // Vehicle Model
        { wch: 12 }, // House No
        { wch: 12 }, // Status
        { wch: 20 }, // Date Added
      ];
      ws["!cols"] = columnWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "License Plates");

      // Generate and save Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(dataBlob, `${fileName}.xlsx`);

    } else if (format === 'csv') {
      // Format data for CSV with UTF-8 BOM
      const csvData = vehicles.map((item: Vehicle) => ({
        "ID": item.id,
        "License Plate": item.license_plate,
        "Vehicle Owner": item.vehicle_owner,
        "Vehicle Model": item.vehicle_model,
        "House No": item.house_no,
        "Status": item.status,
        "Date Added": moment(item.date_added).format("D MMM YYYY HH:mm"),
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([UTF8_BOM + csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${fileName}.csv`);

    } else if (format === 'pdf') {
      const doc = new jsPDF('portrait');
      doc.setFont('helvetica');

      const columnMappings: Record<string, string> = {
        license_plate: 'License Plate',
        vehicle_owner: 'Vehicle Owner',
        vehicle_model: 'Vehicle Model',
        house_no: 'House No',
        status: 'Status',
        date_added: 'Date Added',
      };

      const importantColumns = Object.keys(columnMappings);
      const tableColumn = importantColumns.map((key) => columnMappings[key]);
      const tableRows = vehicles.map((vehicle) =>
        importantColumns.map((col) => {
          if (col === 'date_added') {
            return moment(vehicle.date_added).format("D MMM YYYY HH:mm");
          }
          return vehicle[col as keyof Vehicle] || '';
        })
      );

      doc.text('LPR License Plates', 14, 30);
      
      // Add summary info
      doc.setFontSize(10);
      doc.text(`Total Records: ${vehicles.length}`, 14, 40);
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
          2: { cellWidth: 35 }, // Vehicle Model
          3: { cellWidth: 22 }, // House No
          4: { cellWidth: 22 }, // Status
          5: { cellWidth: 35 }, // Date Added
        },
      });
      doc.save(`${fileName}.pdf`);
    }

    toast.success(`License plates exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Error exporting license plates'
    );
  }
};
