import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar24 } from "@/core/commons/calendar"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const GenerateReportButton = () => {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState<string | undefined>();
    const [endDate, setEndDate] = useState<string | undefined>();
    const [fileFormat, setFileFormat] = useState<"csv" | "pdf" | "xlsx">("pdf");


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex flex-row items-center pl-2 py-2 cursor-pointer">
                    <Button>
                        Generate Report
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Generate instant Report</DialogTitle>
                    <DialogDescription>
                        Select the date range and format for your report.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Calendar24
                            label="From"
                            value={startDate}
                            onchange={setStartDate}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Calendar24
                            label="To"
                            value={endDate}
                            onchange={setEndDate}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>File Format</Label>
                        <Select value={fileFormat} onValueChange={(value: "csv" | "pdf" | "xlsx") => setFileFormat(value)}>
                            <SelectTrigger
                                className="w-full"
                            >
                                <SelectValue placeholder="Select format"
                                    className="w-full"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                    >
                        Generate Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}