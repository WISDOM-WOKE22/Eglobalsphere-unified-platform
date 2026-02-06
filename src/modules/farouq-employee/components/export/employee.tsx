import { toast } from "sonner";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import moment from "moment";
import { FarouqEmployee } from "@/types";

const UTF8_BOM = "\uFEFF";

interface FarouqEmployeeExportData {
//   employee_id: string;
  full_name: string;
  email: string;
  department: string;
  position: string;
  role: string;
  status: string;
  date_registered: string;
}

export const exportFarouqEmployees = (
  format: "csv" | "pdf" | "excel",
  currentData: FarouqEmployee[]
) => {
  try {
    const employees = currentData;
    const fileName = "farouq_employees";

    if (format === "excel") {
      const columnMappings: Record<keyof FarouqEmployeeExportData, string> = {
        // employee_id: "Employee ID",
        full_name: "Full Name",
        email: "Email",
        department: "Department",
        position: "Position",
        role: "Role",
        status: "Status",
        date_registered: "Date Registered",
      };

      const formattedData = employees.map((item) => ({
        "Employee ID": String(item.employee_id ?? ""),
        "Full Name": String(item.full_name ?? ""),
        "Email": String(item.email ?? ""),
        "Department": String(item.department ?? ""),
        "Position": String(item.position ?? ""),
        "Role": String(item.role ?? ""),
        "Status": String(item.status ?? ""),
        "Date Registered": item.date_registered
          ? moment(item.date_registered).format("D MMM YYYY")
          : "",
      }));

      const ws = XLSX.utils.json_to_sheet(formattedData, {
        header: Object.values(columnMappings),
      });
      ws["!cols"] = [
        // { wch: 18 },
        { wch: 50 },
        { wch: 50 },
        { wch: 40 },
        { wch: 40 },
        { wch: 12 },
        { wch: 12 },
        { wch: 40 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Employees");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(dataBlob, `${fileName}.xlsx`);
    } else if (format === "csv") {
      const csvData = employees.map((item) => ({
        "Employee ID": String(item.employee_id ?? ""),
        "Full Name": String(item.full_name ?? ""),
        "Email": String(item.email ?? ""),
        "Department": String(item.department ?? ""),
        "Position": String(item.position ?? ""),
        "Role": String(item.role ?? ""),
        "Status": String(item.status ?? ""),
        "Date Registered": item.date_registered
          ? moment(item.date_registered).format("D MMM YYYY")
          : "",
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([UTF8_BOM + csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${fileName}.csv`);
    } else if (format === "pdf") {
      const doc = new jsPDF("landscape");
      doc.setFont("helvetica");

      const columnMappings: Record<string, string> = {
        employee_id: "Employee ID",
        full_name: "Full Name",
        email: "Email",
        department: "Department",
        position: "Position",
        role: "Role",
        status: "Status",
        date_registered: "Date Registered",
      };

      const keys = Object.keys(columnMappings);
      const tableColumn = keys.map((key) => columnMappings[key]);
      const tableRows = employees.map((employee) =>
        keys.map((col) => {
          if (col === "date_registered") {
            return employee.date_registered
              ? moment(employee.date_registered).format("D MMM YYYY")
              : "";
          }
          return String(employee[col as keyof FarouqEmployee] ?? "");
        })
      );

      doc.text("Farouq Employees", 14, 30);
      doc.setFontSize(10);
      doc.text(`Total Employees: ${employees.length}`, 14, 40);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 46);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        styles: { fontSize: 8, cellPadding: 2, minCellHeight: 10 },
        headStyles: { fillColor: "#03AF69" },
        columnStyles: {
        //   0: { cellWidth: 22 },
          1: { cellWidth: 50 },
          2: { cellWidth: 50 },
          3: { cellWidth: 22 },
          4: { cellWidth: 22 },
          5: { cellWidth: 40 },
          6: { cellWidth: 16 },
          7: { cellWidth: 22 },
        },
      });
      doc.save(`${fileName}.pdf`);
    }

    toast.success(`Employees exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Error exporting employees"
    );
  }
};
