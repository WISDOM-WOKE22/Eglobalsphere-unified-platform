import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getStatusBadge } from "@/core/commons/components/badge/badge"
import { useRouter } from "next/navigation";
import { ExportData } from "@/core/commons/dialogs"
import { useSpherexVisitorsService } from "../../services"
import { Skeleton } from "@/components/ui/skeleton"
import { exportSpherexVisitors } from "../export"

export const VisitorsTable = () => {
    const { data, isLoading } = useSpherexVisitorsService()
    const { push } = useRouter()

    // Handle export functionality
    const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
        if (data?.visitors && data.visitors.length > 0) {
            exportSpherexVisitors(format, data.visitors);
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
                    disabled={isLoading || !data?.visitors || data.visitors.length === 0}
                />
            </CardHeader>
            <CardContent>
                <Table >
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Fullname</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Zone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoading ? (
                        <TableBody>
                                 {[1,2,3,4,5,6].map((index) => <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-full" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                </TableRow>)}
                        </TableBody>
                    ) : (
                    <TableBody>
                        {data?.visitors.map((employee, index) => (
                            <TableRow key={index}>
                                <TableCell>{employee.fullname}</TableCell>
                                <TableCell>{employee.phone}</TableCell>
                                <TableCell>{employee.zone ?? "unassigned"}</TableCell>
                                <TableCell>{getStatusBadge(employee.status)}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => push(`/spherex-visitors/${index + 1}`)}
                                        variant="outline">View</Button>
                                </TableCell>
                            </TableRow>))}
                    </TableBody>
                    )}
                </Table>
            </CardContent>
        </Card>
    )
}