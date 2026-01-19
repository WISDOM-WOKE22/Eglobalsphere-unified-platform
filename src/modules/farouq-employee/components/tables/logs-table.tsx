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
import { exportFarouqLogs } from "../export"
import { FarouqLog } from "@/types"

const ITEMS_PER_PAGE = 20

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
    
    // Build query parameters for server-side filtering and pagination
    const queryParams = useMemo(() => ({
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
        ...(searchTerm && { search: searchTerm }),
    }), [currentPage, searchTerm])

    const { data, isLoading } = useFarouqLogsService(queryParams)
    
    // Calculate pagination from server data
    const pagination = data?.doc?.pagination
    const totalPages = pagination?.total_pages ?? 0
    const actualPage = pagination?.page ?? currentPage
    const pageSize = pagination?.page_size ?? ITEMS_PER_PAGE
    const startIndex = (actualPage - 1) * pageSize
    const currentPageItemCount = data?.doc?.logs?.length ?? 0
    const endIndex = startIndex + currentPageItemCount

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    // Handle search input change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reset to first page on new search
    }

    // Handle export functionality
    const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
        if (data?.doc?.logs && data.doc.logs.length > 0) {
            exportFarouqLogs(format, data.doc.logs);
        }
    };

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
                    onExport={handleExport}
                    disabled={isLoading || !data?.doc?.logs || data.doc.logs.length === 0}
                />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>User Name</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead className="text-center">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28 mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.doc?.logs && data.doc.logs.length > 0 ? (
                            data.doc.logs.map((log: FarouqLog) => (
                                <TableRow key={log.id} className="hover:bg-muted/50 transition-colors h-12">
                                    <TableCell className="font-medium h-6">{log.user_name}</TableCell>
                                    <TableCell className="h-6">{getMethodBadge(log.method)}</TableCell>
                                    <TableCell className="h-6">{getStatusBadge(log.status)}</TableCell>
                                    {/* <TableCell>
                                        {log.confidence !== "N/A" ? (
                                            <span className="text-sm font-medium">{log.confidence}</span>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">N/A</span>
                                        )}
                                    </TableCell> */}
                                    <TableCell className="max-w-[200px] truncate h-6" title={log.notes}>
                                        {log.notes}
                                    </TableCell>
                                    <TableCell className="text-center h-6">
                                        {moment(log.timestamp).format("D MMM YYYY HH:mm")}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? `No logs found matching "${searchTerm}"` : "No logs found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {!isLoading && data && data.doc?.logs && data.doc.logs.length > 0 && pagination && (
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{endIndex}</span>{' '}
                        of <span className="font-medium">{pagination.total}</span> result{pagination.total !== 1 ? 's' : ''}
                        {pagination.total_pages > 1 && ` (Page ${pagination.page} of ${pagination.total_pages})`}
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
