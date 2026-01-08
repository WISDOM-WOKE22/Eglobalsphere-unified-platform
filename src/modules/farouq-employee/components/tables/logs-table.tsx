import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import moment from "moment"
import { ExportData } from "@/core/commons/dialogs"
import { useFarouqLogsService } from "../../services/logs"
import { FarouqLog } from "@/types"

const ITEMS_PER_PAGE = 10

// Helper function to get badge variant for log type
const getLogTypeBadge = (logType: string) => {
    const variants: Record<string, { className: string }> = {
        "Check In/Out": { className: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
        "Attendance": { className: "bg-green-100 text-green-800 hover:bg-green-200" },
        "Audit": { className: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
    }
    const config = variants[logType] || { className: "bg-gray-100 text-gray-800 hover:bg-gray-200" }
    return <Badge className={config.className}>{logType}</Badge>
}

// Helper function to get badge variant for status
const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
        check_in: { label: "Check In", className: "bg-green-100 text-green-800 hover:bg-green-200" },
        check_out: { label: "Check Out", className: "bg-red-100 text-red-800 hover:bg-red-200" },
        present: { label: "Present", className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" },
        absent: { label: "Absent", className: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
    }
    const config = variants[status] || { label: status, className: "bg-gray-100 text-gray-800 hover:bg-gray-200" }
    return <Badge className={config.className}>{config.label}</Badge>
}

// Helper function to get badge variant for method
const getMethodBadge = (method: string | null) => {
    if (!method) return <span className="text-muted-foreground text-sm">N/A</span>

    const variants: Record<string, { label: string; className: string }> = {
        face_recognition: { label: "Face Recognition", className: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200" },
        manual: { label: "Manual", className: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
    }
    const config = variants[method] || { label: method, className: "bg-gray-100 text-gray-800 hover:bg-gray-200" }
    return <Badge className={config.className} variant="outline">{config.label}</Badge>
}

export const FarouqLogsTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const { data, isLoading } = useFarouqLogsService()
    // Filter logs based on search term
    const filteredLogs = useMemo(() => {
        if (!data?.doc?.logs) return []
        if (!searchTerm) return data.doc.logs
        const term = searchTerm.toLowerCase()
        return data.doc.logs.filter(
            (log: FarouqLog) =>
                log.user_name.toLowerCase().includes(term) ||
                log.log_type.toLowerCase().includes(term) ||
                log.status.toLowerCase().includes(term) ||
                log.method?.toLowerCase().includes(term) ||
                log.notes.toLowerCase().includes(term) ||
                log.zone.toLowerCase().includes(term)
        )
    }, [searchTerm, data?.doc?.logs])

    // Calculate pagination
    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    // Handle search input change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reset to first page on new search
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <Input
                    className="w-full max-w-[300px]"
                    placeholder="Search by user, type, status, or notes"
                    value={searchTerm}
                    onChange={handleSearch}
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
                            <TableHead>User Name</TableHead>
                            <TableHead>Log Type</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Zone</TableHead>
                            <TableHead>Confidence</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead className="text-center">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28 mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : paginatedLogs.length > 0 ? (
                            paginatedLogs.map((log: FarouqLog) => (
                                <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium">{log.user_name}</TableCell>
                                    <TableCell>{getLogTypeBadge(log.log_type)}</TableCell>
                                    <TableCell>{getMethodBadge(log.method)}</TableCell>
                                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                                    <TableCell>
                                        {log.zone !== "N/A" ? log.zone : <span className="text-muted-foreground text-sm">N/A</span>}
                                    </TableCell>
                                    <TableCell>
                                        {log.confidence !== "N/A" ? (
                                            <span className="text-sm font-medium">{log.confidence}</span>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={log.notes}>
                                        {log.notes}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {moment(log.timestamp).format("D MMM YYYY HH:mm")}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? `No logs found matching "${searchTerm}"` : "No logs found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {!isLoading && filteredLogs.length > 0 && (
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        {totalPages > 1 ? (
                            <>
                                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)}
                                </span>{' '}
                                of <span className="font-medium">{filteredLogs.length}</span> results
                                {searchTerm && data?.doc?.pagination && ` (filtered from ${data.doc.pagination.total} total)`}
                            </>
                        ) : (
                            <>
                                Showing <span className="font-medium">{filteredLogs.length}</span> result
                                {filteredLogs.length !== 1 ? 's' : ''}
                                {searchTerm && data?.doc?.pagination && ` (filtered from ${data.doc.pagination.total} total)`}
                            </>
                        )}
                    </div>
                    {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(currentPage - 1)
                                    }}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>

                            {/* First page */}
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(1)
                                    }}
                                    isActive={currentPage === 1}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>

                            {/* First ellipsis */}
                            {currentPage > 3 && totalPages > 5 && (
                                <PaginationItem>
                                    <span className="px-2">...</span>
                                </PaginationItem>
                            )}

                            {/* Middle pages */}
                            {(() => {
                                const pages = []
                                let startPage = Math.max(2, currentPage - 1)
                                let endPage = Math.min(totalPages - 1, currentPage + 1)

                                // Adjust if we're at the start
                                if (currentPage <= 3) {
                                    endPage = Math.min(4, totalPages - 1)
                                }
                                // Adjust if we're at the end
                                else if (currentPage >= totalPages - 2) {
                                    startPage = Math.max(2, totalPages - 3)
                                }

                                for (let i = startPage; i <= endPage; i++) {
                                    if (i > 1 && i < totalPages) {
                                        pages.push(
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        handlePageChange(i)
                                                    }}
                                                    isActive={i === currentPage}
                                                >
                                                    {i}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    }
                                }
                                return pages
                            })()}

                            {/* Last ellipsis */}
                            {currentPage < totalPages - 2 && totalPages > 5 && (
                                <PaginationItem>
                                    <span className="px-2">...</span>
                                </PaginationItem>
                            )}

                            {/* Last page */}
                            {totalPages > 1 && (
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handlePageChange(totalPages)
                                        }}
                                        isActive={currentPage === totalPages}
                                    >
                                        {totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(currentPage + 1)
                                    }}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                    )}
                </CardFooter>
            )}
        </Card>
    )
}
