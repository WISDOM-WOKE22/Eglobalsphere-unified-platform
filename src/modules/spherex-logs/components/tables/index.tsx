import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import moment from "moment"
import { cn } from "@/lib/utils"
import { getStatusBadge } from "@/core/commons/components/badge/badge"
import { renderLicensePlate } from "@/core/commons/utils"
import { ExportData } from "@/core/commons/dialogs"
import { exportSpherexLogs } from "../export"
import { useSpherexLogsService } from "../../services"

export const SpherexLogTable = () => {
    // Filter and pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [logTypeFilter, setLogTypeFilter] = useState("")
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
    const pageSize = 20

    // Build query parameters
    const queryParams = useMemo(() => ({
        page: currentPage,
        page_size: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(logTypeFilter && { log_type: logTypeFilter }),
        ...(dateFrom && { date_from: format(dateFrom, "yyyy-MM-dd") }),
        ...(dateTo && { date_to: format(dateTo, "yyyy-MM-dd") }),
    }), [currentPage, searchTerm, logTypeFilter, dateFrom, dateTo])

    const { data, isLoading } = useSpherexLogsService(queryParams)

    // Calculate pagination
    const totalPages = data ? Math.ceil(data.total / pageSize) : 0
    const startIndex = (currentPage - 1) * pageSize

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    // Handle log type filter
    const handleLogTypeFilter = (value: string) => {
        setLogTypeFilter(value === "all" ? "" : value)
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

    // Handle export functionality
    const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
        if (data?.logs && data.logs.length > 0) {
            exportSpherexLogs(format, data.logs);
        }
    };

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex flex-row justify-between items-start gap-4">
                    <div className="flex flex-col gap-3 flex-1">
                        {/* First row: Search and Log Type */}
                        <div className="flex flex-row items-center gap-3">
                            <Input
                                className="w-full max-w-[300px]"
                                placeholder="Search by license plate"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <Select value={logTypeFilter || "all"} onValueChange={handleLogTypeFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Log Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Log Types</SelectItem>
                                    <SelectItem value="gate">Gate</SelectItem>
                                    <SelectItem value="violation">Violation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Second row: Date filters */}
                        <div className="flex flex-row items-center gap-3">
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
                                        {dateFrom ? format(dateFrom, "PPP") : "From date"}
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
                                        {dateTo ? format(dateTo, "PPP") : "To date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateTo}
                                        onSelect={handleDateToChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {(dateFrom || dateTo) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setDateFrom(undefined)
                                        setDateTo(undefined)
                                        setCurrentPage(1)
                                    }}
                                >
                                    Clear dates
                                </Button>
                            )}
                        </div>
                    </div>
                    <ExportData
                        title="Export data"
                        buttonTitle="Export data"
                        onExport={handleExport}
                        disabled={isLoading || !data?.logs || data.logs.length === 0}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Log Type</TableHead>
                            <TableHead>License Plate</TableHead>
                            <TableHead>Authorized</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoading ? (
                        <TableBody>
                            {[1,2,3,4,5,6].map((index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            {data?.logs && data.logs.length > 0 ? (
                                data.logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-sm text-muted-foreground">{log.id}</TableCell>
                                        <TableCell>{log.log_type}</TableCell>
                                        <TableCell className="font-medium">
                                            {renderLicensePlate(log.license_plate)}
                                        </TableCell>
                                        <TableCell>
                                            {log.authorized ? (
                                                <span className="text-green-600 font-medium">Yes</span>
                                            ) : (
                                                <span className="text-red-600 font-medium">No</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                                        <TableCell>{moment(log.time).format("D MMM YYYY HH:mm")}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No logs found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    )}
                </Table>
            </CardContent>
            {!isLoading && data && data.logs.length > 0 && (
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">
                            {Math.min(startIndex + pageSize, data.total)}
                        </span>{' '}
                        of <span className="font-medium">{data.total}</span> logs
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

                                {currentPage > 3 && totalPages > 5 && (
                                    <PaginationItem>
                                        <span className="px-2">...</span>
                                    </PaginationItem>
                                )}

                                {(() => {
                                    const pages = []
                                    let startPage = Math.max(2, currentPage - 1)
                                    let endPage = Math.min(totalPages - 1, currentPage + 1)

                                    if (currentPage <= 3) {
                                        endPage = Math.min(4, totalPages - 1)
                                    } else if (currentPage >= totalPages - 2) {
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

                                {currentPage < totalPages - 2 && totalPages > 5 && (
                                    <PaginationItem>
                                        <span className="px-2">...</span>
                                    </PaginationItem>
                                )}

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