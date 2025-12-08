import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileSpreadsheet, FileText } from "lucide-react"

export function ExportData({
    title = "Export Data",
    buttonTitle = "Export",
    buttonVariant = "default",
}: {
    title?: string;
    description?: string;
    buttonTitle?: string;
    buttonVariant?: "outline" | "default" | "destructive" | "secondary" | "link" | "ghost";
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={buttonVariant ?? "default"}>{buttonTitle}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{title}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log("Export PDF")}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Export as PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Export Excel")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Export as Excel</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
