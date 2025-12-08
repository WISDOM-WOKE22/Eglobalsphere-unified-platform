import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus } from "lucide-react"
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
import { supportData } from "@/constants/support";
import { useRouter } from "next/navigation";

export const SupportTable = () => {
    const router = useRouter();
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <h1>All Tickets</h1>
                <Button onClick={() => router.push("/support/create-ticket")}><Plus />Create new Ticket</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Sent By</TableHead>
                            <TableHead>Created At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {supportData.map((ticket, index) => (
                            <TableRow key={ticket.id || index}>
                                <TableCell>{ticket.id}</TableCell>
                                <TableCell>{ticket.title}</TableCell>
                                <TableCell className="max-w-xs truncate">{ticket.description}</TableCell>
                                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                <TableCell>{ticket.sentBy}</TableCell>
                                <TableCell>{new Date(ticket.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}