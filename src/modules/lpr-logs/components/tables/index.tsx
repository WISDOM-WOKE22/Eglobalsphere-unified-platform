import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getStatusBadge } from "@/core/commons/components/badge/badge"
import { renderLicensePlate } from "@/core/commons/utils"
import { ExportData } from "@/core/commons/dialogs"
import { useLPRLogsService } from "../../services"
import { exportLPRLogs } from "../export"
import { LPRLog } from "@/types"

export const LPRGateAccessTable = () => {
    // Filter and pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
    const pageSize = 20

    // Build query parameters for server-side filtering
    const queryParams = useMemo(() => ({
        page: currentPage,
        page_size: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(dateFrom && { date_from: format(dateFrom, "yyyy-MM-dd") }),
        ...(dateTo && { date_to: format(dateTo, "yyyy-MM-dd") }),
    }), [currentPage, searchTerm, dateFrom, dateTo])

    const { data, isLoading } = useLPRLogsService(queryParams)

    // Calculate pagination from server data
    const totalPages = data ? Math.ceil(data.total / pageSize) : 0
    const startIndex = (currentPage - 1) * pageSize

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    // Handle search input change
    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1) // Reset to first page on new search
    }

    // Handle date filters
    const handleDateFromChange = (date: Date | undefined) => {
        setDateFrom(date)
        setCurrentPage(1)
    }

    const handleDateToChange = (date: Date | undefined) => {
        setDateTo(date)
        setCurrentPage(1)
    }

    // Clear all filters
    const handleClearFilters = () => {
        setSearchTerm("")
        setDateFrom(undefined)
        setDateTo(undefined)
        setCurrentPage(1)
    }

    // Check if any filters are active
    const hasActiveFilters = searchTerm || dateFrom || dateTo

    // Handle export functionality
    const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
        if (data?.logs && data.logs.length > 0) {
            exportLPRLogs(format, data.logs);
        }
    }

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex flex-col gap-4">
                    {/* Top row: Search and Export */}
                    <div className="flex flex-row justify-between items-center gap-4">
                        <Input
                            className="w-full max-w-[400px]"
                            placeholder="Search by license plate or vehicle owner..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <ExportData
                            title="Export data"
                            buttonTitle="Export data"
                            onExport={handleExport}
                            disabled={isLoading || !data?.logs || data.logs.length === 0}
                        />
                    </div>

                    {/* Bottom row: Date filters and Clear button */}
                    <div className="flex flex-row items-center gap-3">
                        {/* Date From Picker */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !dateFrom && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateFrom ? format(dateFrom, "PPP") : "Date From"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateFrom}
                                    onSelect={handleDateFromChange}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Date To Picker */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !dateTo && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateTo ? format(dateTo, "PPP") : "Date To"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateTo}
                                    onSelect={handleDateToChange}
                                    initialFocus
                                    disabled={(date) =>
                                        dateFrom ? date < dateFrom : false
                                    }
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                onClick={handleClearFilters}
                                className="flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                Clear Filters
                            </Button>
                        )}

                        {/* Active Filters Indicator */}
                        {hasActiveFilters && (
                            <div className="text-sm text-muted-foreground ml-auto">
                                {data && `Filtered: ${data.total} result${data.total !== 1 ? 's' : ''}`}
                            </div>
                        )}
                    </div>
                </div>
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
                        ) : data?.logs && data.logs.length > 0 ? (
                            data.logs.map((log: LPRLog) => (
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
                                    {hasActiveFilters 
                                        ? "No logs found matching your filter criteria" 
                                        : "No access logs found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {!isLoading && data && data.logs.length > 0 && (
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">
                            {Math.min(startIndex + pageSize, data.total)}
                        </span>{' '}
                        of <span className="font-medium">{data.total}</span> log{data.total !== 1 ? 's' : ''}
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