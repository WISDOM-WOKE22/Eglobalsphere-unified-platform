import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { spherexLogs } from "@/constants/spherex"
import { getStatusBadge } from "@/core/commons/components/badge/badge"
import { ExportData } from "@/core/commons/dialogs"
import { exportSpherexLogs } from "../export"
// import { useSpherexLogsService } from "../../services"

export const SpherexLogTable = () => {
    // const { data, isLoading } = useSpherexLogsService()

    // Handle export functionality
    const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
        if (spherexLogs && spherexLogs.length > 0) {
            exportSpherexLogs(format, spherexLogs);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-rows justify-between items-center">
                <Input
                    className="w-full max-w-[300px]"
                    placeholder="Search by fullname"
                />
                <ExportData
                    title="Export data"
                    buttonTitle="Export data"
                    onExport={handleExport}
                    disabled={!spherexLogs}
                />
            </CardHeader>
            <CardContent>
                <Table >
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Fullname</TableHead>
                            {/* <TableHead>Department</TableHead> */}
                            <TableHead>Department</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {spherexLogs.map((i, index) => (
                            <TableRow key={index}>
                                <TableCell>{i.ID}</TableCell>
                                <TableCell>{i.fullname}</TableCell>
                                {/* <TableCell>{i.department}</TableCell> */}
                                <TableCell>{i.department}</TableCell>
                                <TableCell>{getStatusBadge(i.type)}</TableCell>
                                <TableCell>{i.note}</TableCell>
                                <TableCell>{i.timestamp}</TableCell>
                            </TableRow>))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}