import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { getStatusBadge } from "@/core/commons/components/badge/badge"
import { useRouter } from "next/navigation";
import { ExportData } from "@/core/commons/dialogs"
import { useSpherexVisitorsService } from "../../services"
import { Skeleton } from "@/components/ui/skeleton"
import { exportSpherexVisitors } from "../export"

export const VisitorsTable = () => {
    const { push } = useRouter()

    // Filter and pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const pageSize = 20

    // Build query parameters
    const queryParams = useMemo(() => ({
        page: currentPage,
        page_size: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status_filter: statusFilter }),
    }), [currentPage, searchTerm, statusFilter])

    const { data, isLoading } = useSpherexVisitorsService(queryParams)

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
        setCurrentPage(1) // Reset to first page on search
    }

    // Handle status filter
    const handleStatusFilter = (value: string) => {
        setStatusFilter(value === "all" ? "" : value)
        setCurrentPage(1)
    }

    // Handle export functionality
    const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
        if (data?.visitors && data.visitors.length > 0) {
            exportSpherexVisitors(format, data.visitors);
        }
    };

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex flex-row justify-between items-center gap-4">
                    <div className="flex flex-row items-center gap-3 flex-1">
                        <Input
                            className="w-full max-w-[300px]"
                            placeholder="Search by fullname, email, or phone"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <Select value={statusFilter || "all"} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <ExportData
                        title="Export data"
                        buttonTitle="Export data"
                        onExport={handleExport}
                        disabled={isLoading || !data?.visitors || data.visitors.length === 0}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table >
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Fullname</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Zone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoading ? (
                        <TableBody>
                                 {[1,2,3,4,5,6].map((index) => <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-full" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-20" />
                                    </TableCell>
                                </TableRow>)}
                        </TableBody>
                    ) : (
                    <TableBody>
                        {data?.visitors.map((employee, index) => (
                            <TableRow key={index}>
                                <TableCell>{employee.fullname}</TableCell>
                                <TableCell>{employee.phone}</TableCell>
                                <TableCell>{employee.zone ?? "unassigned"}</TableCell>
                                <TableCell>{getStatusBadge(employee.status)}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => push(`/spherex-visitors/${index + 1}`)}
                                        variant="outline">View</Button>
                                </TableCell>
                            </TableRow>))}
                    </TableBody>
                    )}
                </Table>
            </CardContent>
            {!isLoading && data && data.visitors.length > 0 && (
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">
                            {Math.min(startIndex + pageSize, data.total)}
                        </span>{' '}
                        of <span className="font-medium">{data.total}</span> visitors
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