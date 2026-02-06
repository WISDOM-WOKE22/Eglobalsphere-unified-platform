import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileSpreadsheet, FileText, FileType, Loader2 } from "lucide-react"

export function ExportData({
    title = "Export Data",
    buttonTitle = "Export",
    buttonVariant = "default",
    onExport,
    disabled = false,
    loading = false,
}: {
    title?: string;
    description?: string;
    buttonTitle?: string;
    buttonVariant?: "outline" | "default" | "destructive" | "secondary" | "link" | "ghost";
    onExport?: (format: 'csv' | 'pdf' | 'excel') => void | Promise<void>;
    disabled?: boolean;
    loading?: boolean;
}) {
    const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
        if (onExport) {
            void Promise.resolve(onExport(format));
        } else {
            console.log(`Export ${format}`);
        }
    };

    const isDisabled = disabled || loading;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={buttonVariant ?? "default"} disabled={isDisabled}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        buttonTitle
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{title}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={loading}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Export as PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')} disabled={loading}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Export as Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')} disabled={loading}>
                    <FileType className="mr-2 h-4 w-4" />
                    <span>Export as CSV</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
