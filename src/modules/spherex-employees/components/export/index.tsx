import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from "xlsx";
import { SpherexEmployee } from '@/types';

interface EmployeeExportData {
  employee_id: string;
  fullname: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  department: string | null;
  zones: string | null;
  status: string;
  enabled: boolean;
  presence: string;
  created_at_source: string | null;
}

export const exportSpherexEmployees = (format: 'csv' | 'pdf' | 'excel', currentData: SpherexEmployee[]) => {
  try {
    const employees = currentData;
    const fileName = 'spherex_employees';

    if (format === 'excel') {
      const columnMappings: Record<keyof EmployeeExportData, string> = {
        employee_id: "Employee ID",
        fullname: "Full Name",
        first_name: "First Name",
        last_name: "Last Name",
        email: "Email",
        mobile_no: "Phone Number",
        department: "Department",
        zones: "Zone",
        status: "Status",
        enabled: "Enabled",
        presence: "Presence",
        created_at_source: "Date Registered",
      };

      // Convert data to match custom headers
      const formattedData = employees.map((item: SpherexEmployee) => ({
        "Employee ID": item.employee_id,
        "Full Name": item.fullname,
        "First Name": item.first_name,
        "Last Name": item.last_name,
        "Email": item.email,
        "Phone Number": item.mobile_no,
        "Department": item.department || "N/A",
        "Zone": item.zones || "N/A",
        "Status": item.status,
        "Enabled": item.enabled ? "Yes" : "No",
        "Presence": item.presence,
        "Date Registered": item.created_at_source || "N/A",
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
      XLSX.utils.book_append_sheet(wb, ws, "SphereX Employees");

      // Generate and save Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(dataBlob, `${fileName}.xlsx`);

    } else if (format === 'csv') {
      // Format data for CSV
      const csvData = employees.map((item: SpherexEmployee) => ({
        "Employee ID": item.employee_id,
        "Full Name": item.fullname,
        "First Name": item.first_name,
        "Last Name": item.last_name,
        "Email": item.email,
        "Phone Number": item.mobile_no,
        "Department": item.department || "N/A",
        "Zone": item.zones || "N/A",
        "Status": item.status,
        "Enabled": item.enabled ? "Yes" : "No",
        "Presence": item.presence,
        "Date Registered": item.created_at_source || "N/A",
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
        employee_id: 'Employee ID',
        fullname: 'Full Name',
        email: 'Email',
        mobile_no: 'Phone',
        department: 'Department',
        zones: 'Zone',
        status: 'Status',
        enabled: 'Enabled',
      };

      const importantColumns = Object.keys(columnMappings);
      const tableColumn = importantColumns.map((key) => columnMappings[key]);
      const tableRows = employees.map((employee) =>
        importantColumns.map((col) => {
          if (col === 'enabled') {
            return employee[col as keyof SpherexEmployee] ? 'Active' : 'Disabled';
          }
          if (col === 'department' || col === 'zones') {
            return employee[col as keyof SpherexEmployee] || 'N/A';
          }
          return employee[col as keyof SpherexEmployee] || '';
        })
      );

      doc.text('SphereX Employees Data', 14, 40);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        styles: { fontSize: 8, cellPadding: 2, minCellHeight: 10 },
        headStyles: { fillColor: '#03AF69' },
        columnStyles: {
          0: { cellWidth: 25 }, // Employee ID
          1: { cellWidth: 35 }, // Full Name
          2: { cellWidth: 45 }, // Email
          3: { cellWidth: 30 }, // Phone
          4: { cellWidth: 30 }, // Department
          5: { cellWidth: 25 }, // Zone
          6: { cellWidth: 20 }, // Status
          7: { cellWidth: 20 }, // Enabled
        },
      });
      doc.save(`${fileName}.pdf`);
    }

    toast.success(`Employees exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Error exporting employees'
    );
  }
};