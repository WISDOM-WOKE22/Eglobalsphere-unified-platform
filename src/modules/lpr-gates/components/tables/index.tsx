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
import moment from "moment"
import { getStatusBadge } from "@/core/commons/components/badge/badge"
import { gates } from "@/constants/lpr"

export const LPRGatesTable = () => {
    return (
        <Card>
            <CardHeader className="flex flex-rows justify-between items-center">
                <Input
                    className="w-full max-w-[300px]"
                    placeholder="Search by gate number, project name"
                />
                <Button>Export data</Button>
            </CardHeader>
            <CardContent>
                <Table >
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Gate number</TableHead>
                            <TableHead>Project name</TableHead>
                            <TableHead>Date added</TableHead>
                            <TableHead>Access type</TableHead>
                            <TableHead>Added by</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gates.map((gate, index) => (
                            <TableRow key={index}>
                                <TableCell>Gate {gate.gate_number}</TableCell>
                                <TableCell>{gate.project_name}</TableCell>
                                <TableCell>{moment(gate.creation).format("DD-MM-YYYY")}</TableCell>
                                <TableCell>{gate.type}</TableCell>
                                <TableCell>{gate.owner}</TableCell>
                                <TableCell>{getStatusBadge(gate.agent_status)}</TableCell>
                            </TableRow>))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}