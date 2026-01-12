import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileSpreadsheet, FileText, FileType } from "lucide-react"

export function ExportData({
    title = "Export Data",
    buttonTitle = "Export",
    buttonVariant = "default",
    onExport,
    disabled = false,
}: {
    title?: string;
    description?: string;
    buttonTitle?: string;
    buttonVariant?: "outline" | "default" | "destructive" | "secondary" | "link" | "ghost";
    onExport?: (format: 'csv' | 'pdf' | 'excel') => void;
    disabled?: boolean;
}) {
    const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
        if (onExport) {
            onExport(format);
        } else {
            console.log(`Export ${format}`);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={buttonVariant ?? "default"} disabled={disabled}>
                    {buttonTitle}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{title}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Export as PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Export as Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileType className="mr-2 h-4 w-4" />
                    <span>Export as CSV</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
