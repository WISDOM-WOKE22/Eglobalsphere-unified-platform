import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { FileX2 } from "lucide-react"
import { useStore } from "@/lib/zustand/store"

// Table Skeleton Loader
const ActivityTableSkeleton = () => (
    <Card className="mt-3">
        <CardHeader className="flex flex-rows justify-between items-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-32" />
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {/* Table Header Skeleton */}
                <div className="flex gap-4 p-3 bg-muted rounded-md">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32 flex-1" />
                    <Skeleton className="h-4 w-48 flex-1" />
                    <Skeleton className="h-4 w-24" />
                </div>
                {/* Table Rows Skeleton */}
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex gap-4 p-3 border-b">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-32 flex-1" />
                        <Skeleton className="h-4 w-48 flex-1" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)

// No Data Component
const NoDataMessage = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileX2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Activities Found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
            This employee doesn&apos;t have any access logs or activities recorded yet.
        </p>
    </div>
)

export const SpherexEmployeeActivityTable = () => {
    const spherexEmployee = useStore((state) => state.spherexEmployee);
    const isLoading = useStore((state) => state.isLoading);

    // Show skeleton loader while loading
    if (isLoading || !spherexEmployee) {
        return <ActivityTableSkeleton />;
    }

    // Check if there are any activities
    const hasActivities = spherexEmployee?.recent_access_logs && spherexEmployee.recent_access_logs.length > 0;

    return (
        <Card className="mt-3">
            <CardHeader className="flex flex-rows justify-between items-center">
                <h1 className="font-bold text-lg">
                    {spherexEmployee?.fullname || spherexEmployee?.first_name} Activities
                </h1>
                <Button disabled={!hasActivities}>Export data</Button>
            </CardHeader>
            <CardContent>
                {!hasActivities ? (
                    <NoDataMessage />
                ) : (
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead>Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {spherexEmployee.recent_access_logs.map((i, index) => (
                                <TableRow key={index}>
                                    <TableCell>{i.ID}</TableCell>
                                    <TableCell>{i.department}</TableCell>
                                    <TableCell>{i.note}</TableCell>
                                    <TableCell>{i.timestamp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}