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
import { SpherexEmployees } from "@/constants/spherex"
import { getStatusBadge } from "@/core/commons/components/badge/badge"

export const EmployeeTable = () => {
    return (
        <Card>
            <CardHeader className="flex flex-rows justify-between items-center">
                <Input
                    className="w-full max-w-[300px]"
                    placeholder="Search by fullname"
                />
                <Button>Export data</Button>
            </CardHeader>
            <CardContent>
                <Table >
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Fullname</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Zone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {SpherexEmployees.map((employee, index) => (
                            <TableRow key={index}>
                                <TableCell>{employee.fullname}</TableCell>
                                <TableCell>{employee.department}</TableCell>
                                <TableCell>{employee.phone}</TableCell>
                                <TableCell>{employee.zone}</TableCell>
                                <TableCell>{employee.role}</TableCell>
                                <TableCell>{getStatusBadge(employee.status)}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>
                                    <Button variant="outline">View</Button>
                                </TableCell>
                            </TableRow>))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}