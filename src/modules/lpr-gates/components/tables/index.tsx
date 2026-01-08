import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import moment from "moment"
import { getStatusBadge } from "@/core/commons/components/badge/badge"
import { ExportData } from "@/core/commons/dialogs"
import { useLPRGatesService } from "../../services"
import { Gate } from "@/types"

export const LPRGatesTable = () => {
    const { data, isLoading } = useLPRGatesService()

    return (
        <Card>
            <CardHeader className="flex flex-rows justify-between items-center">
                <Input
                    className="w-full max-w-[300px]"
                    placeholder="Search by gate number, project name"
                />
                <ExportData
                    title="Export data"
                    buttonTitle="Export data"
                />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Gate Number</TableHead>
                            <TableHead>Project Name</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Access Type</TableHead>
                            <TableHead>Added By</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.gates && data.gates.length > 0 ? (
                            // Display actual data
                            data.gates.map((gate: Gate) => (
                                <TableRow key={gate.id}>
                                    <TableCell className="font-medium">{gate.gate_name}</TableCell>
                                    <TableCell>{gate.project_name}</TableCell>
                                    <TableCell>
                                        {moment(gate.date_added).format("DD-MM-YYYY")}
                                    </TableCell>
                                    <TableCell>{gate.access_type}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={gate.added_by}>
                                        {gate.added_by}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(gate.status)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            // Empty state
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No gates found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {data?.gates && data.gates.length > 0 && (
                    <div className="flex items-center justify-between px-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Showing {data.gates.length} of {data.total} gates
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}