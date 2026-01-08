import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { getStatusBadge } from "@/core/commons/components/badge/badge"
import { renderLicensePlate } from "@/core/commons/utils"
import { ExportData } from "@/core/commons/dialogs"
import { useLPRLogsService } from "../../services"
import { LPRLog } from "@/types"

const ITEMS_PER_PAGE = 20

export const LPRGateAccessTable = () => {
    const { data, isLoading } = useLPRLogsService()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")

    // Filter logs based on search term
    const filteredLogs = useMemo(() => {
        if (!data?.logs) return []
        if (!searchTerm) return data.logs
        const term = searchTerm.toLowerCase()
        return data.logs.filter(
            (log: LPRLog) =>
                log.license_plate.toLowerCase().includes(term) ||
                log.vehicle_owner.toLowerCase().includes(term) ||
                log.gate.toLowerCase().includes(term) ||
                log.gate_access_type.toLowerCase().includes(term) ||
                log.authorization_status.toLowerCase().includes(term)
        )
    }, [searchTerm, data?.logs])

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
                    placeholder="Search by license plate, house no, Owner"
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
                            <TableHead>License Plate</TableHead>
                            <TableHead>Vehicle Owner</TableHead>
                            <TableHead>Gate</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Gate Access Type</TableHead>
                            <TableHead className="text-center">Time</TableHead>
                            <TableHead className="text-center">Authorization status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : paginatedLogs.length > 0 ? (
                            paginatedLogs.map((log: LPRLog) => (
                                <TableRow 
                                    key={log.id}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    <TableCell className="font-medium">
                                        {renderLicensePlate(log.license_plate)}
                                    </TableCell>
                                    <TableCell className="capitalize">{log.vehicle_owner}</TableCell>
                                    <TableCell>{log.gate}</TableCell>
                                    <TableCell>{log.date}</TableCell>
                                    <TableCell>{getStatusBadge(log.gate_access_type)}</TableCell>
                                    <TableCell className="text-center">{log.time}</TableCell>
                                    <TableCell className="flex items-center justify-center">
                                        {getStatusBadge(log.authorization_status)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? `No logs found matching "${searchTerm}"` : "No access logs found"}
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
                                {searchTerm && data && ` (filtered from ${data.total} total)`}
                            </>
                        ) : (
                            <>
                                Showing <span className="font-medium">{filteredLogs.length}</span> result
                                {filteredLogs.length !== 1 ? 's' : ''}
                                {searchTerm && data && ` (filtered from ${data.total} total)`}
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