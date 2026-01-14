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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { useViolationLogsService } from "../../services"
import { exportViolationLogs } from "../export"
import { ViolationLog } from "@/types"

export const ViolationLogsTable = () => {
    // Filter and pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [violationType, setViolationType] = useState("")
    const [isRegistered, setIsRegistered] = useState("")
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
    const pageSize = 20

    // Build query parameters for server-side filtering
    const queryParams = useMemo(() => ({
        page: currentPage,
        page_size: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(violationType && { violation_type: violationType }),
        ...(isRegistered && { is_registered: isRegistered }),
        ...(dateFrom && { date_from: format(dateFrom, "yyyy-MM-dd") }),
        ...(dateTo && { date_to: format(dateTo, "yyyy-MM-dd") }),
    }), [currentPage, searchTerm, violationType, isRegistered, dateFrom, dateTo])

    const { data, isLoading } = useViolationLogsService(queryParams)

    // Calculate pagination from server data
    const totalPages = data?.pagination ? Math.ceil(data.pagination.total / pageSize) : 0
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

    // Handle violation type filter
    const handleViolationTypeChange = (value: string) => {
        setViolationType(value === "all" ? "" : value)
        setCurrentPage(1)
    }

    // Handle registration status filter
    const handleIsRegisteredChange = (value: string) => {
        setIsRegistered(value === "all" ? "" : value)
        setCurrentPage(1)
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
        setViolationType("")
        setIsRegistered("")
        setDateFrom(undefined)
        setDateTo(undefined)
        setCurrentPage(1)
    }

    // Check if any filters are active
    const hasActiveFilters = searchTerm || violationType || isRegistered || dateFrom || dateTo

    // Handle export functionality
    const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
        if (data?.data && data.data.length > 0) {
            exportViolationLogs(format, data.data);
        }
    };

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex flex-col gap-4">
                    {/* Top row: Search and Export */}
                    <div className="flex flex-row justify-between items-center gap-4">
                        <Input
                            className="w-full max-w-[400px]"
                            placeholder="Search by license plate, vehicle owner, or gate..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <ExportData
                            title="Export data"
                            buttonTitle="Export data"
                            onExport={handleExport}
                            disabled={isLoading || !data?.data || data.data.length === 0}
                        />
                    </div>

                    {/* Second row: Dropdown filters */}
                    <div className="flex flex-row items-center gap-3 flex-wrap">
                        {/* Violation Type Filter */}
                        <Select value={violationType || "all"} onValueChange={handleViolationTypeChange}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All Violation Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Violation Types</SelectItem>
                                <SelectItem value="SPEED">Speed Violation</SelectItem>
                                <SelectItem value="ONEWAY">One-Way Violation</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Registration Status Filter */}
                        <Select value={isRegistered || "all"} onValueChange={handleIsRegisteredChange}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All Vehicles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Vehicles</SelectItem>
                                <SelectItem value="true">Registered Only</SelectItem>
                                <SelectItem value="false">Unregistered Only</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Date From Picker */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[200px] justify-start text-left font-normal",
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
                                        "w-[200px] justify-start text-left font-normal",
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
                        {hasActiveFilters && data?.pagination && (
                            <div className="text-sm text-muted-foreground ml-auto">
                                Filtered: {data.pagination.total} result{data.pagination.total !== 1 ? 's' : ''}
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
                            <TableHead>Violation Type</TableHead>
                            <TableHead className="text-center">Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.data && data.data.length > 0 ? (
                            data.data.map((violation: ViolationLog) => (
                                <TableRow 
                                    key={violation.id}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    <TableCell className="font-medium">
                                        {renderLicensePlate(violation.license_plate)}
                                    </TableCell>
                                    <TableCell className="capitalize">{violation.vehicle_owner}</TableCell>
                                    <TableCell>{violation.gate}</TableCell>
                                    <TableCell>{violation.violation_date}</TableCell>
                                    <TableCell>{getStatusBadge(violation.violation_type)}</TableCell>
                                    <TableCell className="text-center">{violation.violation_time}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    {hasActiveFilters 
                                        ? "No violations found matching your filter criteria" 
                                        : "No violations found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {!isLoading && data?.data && data.data.length > 0 && data.pagination && (
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">
                            {Math.min(startIndex + pageSize, data.pagination.total)}
                        </span>{' '}
                        of <span className="font-medium">{data.pagination.total}</span> violation{data.pagination.total !== 1 ? 's' : ''}
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