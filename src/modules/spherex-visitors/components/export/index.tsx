import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from "xlsx";
import { SpherexVisitor } from '@/types';

interface VisitorExportData {
  visitor_id: string;
  fullname: string;
  email: string;
  phone: string | null;
  zone: string | null;
  address: string | null;
  status: string;
  last_access: string;
}

export const exportSpherexVisitors = (format: 'csv' | 'pdf' | 'excel', currentData: SpherexVisitor[]) => {
  try {
    const visitors = currentData;
    const fileName = 'spherex_visitors';

    if (format === 'excel') {
      const columnMappings: Record<keyof VisitorExportData, string> = {
        visitor_id: "Visitor ID",
        fullname: "Full Name",
        email: "Email",
        phone: "Phone Number",
        zone: "Zone",
        address: "Address",
        status: "Status",
        last_access: "Last Access",
      };

      // Convert data to match custom headers
      const formattedData = visitors.map((item: SpherexVisitor) => ({
        "Visitor ID": item.visitor_id,
        "Full Name": item.fullname,
        "Email": item.email,
        "Phone Number": item.phone || "N/A",
        "Zone": item.zone || "N/A",
        "Address": item.address || "N/A",
        "Status": item.status,
        "Last Access": item.last_access,
      }));

      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData, {
        header: Object.values(columnMappings),
      });

      // Set column widths
      const columnWidths = Object.keys(columnMappings).map(() => ({ wch: 20 }));
      ws["!cols"] = columnWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SphereX Visitors");

      // Generate and save Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(dataBlob, `${fileName}.xlsx`);

    } else if (format === 'csv') {
      // Format data for CSV
      const csvData = visitors.map((item: SpherexVisitor) => ({
        "Visitor ID": item.visitor_id,
        "Full Name": item.fullname,
        "Email": item.email,
        "Phone Number": item.phone || "N/A",
        "Zone": item.zone || "N/A",
        "Address": item.address || "N/A",
        "Status": item.status,
        "Last Access": item.last_access,
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
    //   const logoUrl = '/assets/logos/darkLogo.png';
    //   const logoWidth = 60;
    //   const logoHeight = 15;
    //   doc.addImage(logoUrl, 'PNG', 10, 10, logoWidth, logoHeight);

      const columnMappings: Record<string, string> = {
        visitor_id: 'Visitor ID',
        fullname: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        zone: 'Zone',
        address: 'Address',
        status: 'Status',
        last_access: 'Last Access',
      };

      const importantColumns = Object.keys(columnMappings);
      const tableColumn = importantColumns.map((key) => columnMappings[key]);
      const tableRows = visitors.map((visitor) =>
        importantColumns.map((col) => {
          if (col === 'phone' || col === 'zone' || col === 'address') {
            return visitor[col as keyof SpherexVisitor] || 'N/A';
          }
          return visitor[col as keyof SpherexVisitor] || '';
        })
      );

      doc.text('SphereX Visitors Data', 14, 40);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        styles: { fontSize: 8, cellPadding: 2, minCellHeight: 10 },
        headStyles: { fillColor: '#03AF69' },
        columnStyles: {
          0: { cellWidth: 25 }, // Visitor ID
          1: { cellWidth: 35 }, // Full Name
          2: { cellWidth: 40 }, // Email
          3: { cellWidth: 25 }, // Phone
          4: { cellWidth: 25 }, // Zone
          5: { cellWidth: 35 }, // Address
          6: { cellWidth: 20 }, // Status
          7: { cellWidth: 30 }, // Last Access
        },
      });
      doc.save(`${fileName}.pdf`);
    }

    toast.success(`Visitors exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Error exporting visitors'
    );
  }
};