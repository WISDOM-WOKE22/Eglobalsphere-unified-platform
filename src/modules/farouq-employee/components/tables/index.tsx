import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
import { ArrowUpDown, X, Mail, Briefcase, Shield } from "lucide-react"
import { getStatusBadge } from "@/core/commons/components/badge/badge"
import moment from "moment"
import { useRouter } from "next/navigation"
import { ExportData } from "@/core/commons/dialogs"
import { useFarouqEmployeeService } from "../../services"
import { FarouqEmployee } from "@/types"

export const FarouqEmployeeTable = () => {
    const router = useRouter()
    
    // Filter and pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [department, setDepartment] = useState("")
    const [status, setStatus] = useState("")
    const [sortBy, setSortBy] = useState("employee_name")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const pageSize = 20

    // Build query parameters for server-side filtering
    const queryParams = useMemo(() => ({
        page: currentPage,
        page_size: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(department && { department }),
        ...(status && { status }),
        sort_by: sortBy,
        sort_order: sortOrder,
    }), [currentPage, searchTerm, department, status, sortBy, sortOrder])

    const { data, isLoading } = useFarouqEmployeeService(queryParams)

    // Calculate pagination from server data
    const totalPages = data?.doc?.pagination ? Math.ceil(data.doc.pagination.total / pageSize) : 0
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

    // Handle department filter
    const handleDepartmentChange = (value: string) => {
        setDepartment(value === "all" ? "" : value)
        setCurrentPage(1)
    }

    // Handle status filter
    const handleStatusChange = (value: string) => {
        setStatus(value === "all" ? "" : value)
        setCurrentPage(1)
    }

    // Handle sorting
    const handleSortChange = (value: string) => {
        setSortBy(value)
        setCurrentPage(1)
    }

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === "asc" ? "desc" : "asc")
        setCurrentPage(1)
    }

    // Clear all filters
    const handleClearFilters = () => {
        setSearchTerm("")
        setDepartment("")
        setStatus("")
        setSortBy("employee_name")
        setSortOrder("asc")
        setCurrentPage(1)
    }

    // Check if any filters are active
    const hasActiveFilters = searchTerm || department || status || sortBy !== "employee_name" || sortOrder !== "asc"

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex flex-col gap-4">
                    {/* Top row: Search and Export */}
                    <div className="flex flex-row justify-between items-center gap-4">
                <Input
                            className="w-full max-w-[400px]"
                            placeholder="Search by name, email, department, or ID..."
                    value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                />
                <ExportData
                    title="Export data"
                    buttonTitle="Export data"
                            disabled={isLoading || !data?.doc?.employees || data.doc.employees.length === 0}
                        />
                    </div>

                    {/* Second row: Filters and Sorting */}
                    <div className="flex flex-row items-center gap-3 flex-wrap">
                        {/* Department Filter */}
                        <Select value={department || "all"} onValueChange={handleDepartmentChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                <SelectItem value="Engineering">Engineering</SelectItem>
                                <SelectItem value="HR">Human Resources</SelectItem>
                                <SelectItem value="Sales">Sales</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="Operations">Operations</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select value={status || "all"} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort By */}
                        <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="employee_name">Name</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="department">Department</SelectItem>
                                <SelectItem value="position">Position</SelectItem>
                                <SelectItem value="date_registered">Date Registered</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort Order Toggle */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleSortOrder}
                            className="h-10 w-10"
                            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
                        >
                            <ArrowUpDown className={`h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                        </Button>

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
                        {hasActiveFilters && data?.doc?.pagination && (
                            <div className="text-sm text-muted-foreground ml-auto">
                                Filtered: {data.doc.pagination.total} result{data.doc.pagination.total !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-muted/50">
                            <TableHead className="font-semibold">Employee ID</TableHead>
                            <TableHead className="font-semibold">Full Name</TableHead>
                            <TableHead className="font-semibold">Contact</TableHead>
                            <TableHead className="font-semibold">Department</TableHead>
                            <TableHead className="font-semibold">Position</TableHead>
                            <TableHead className="font-semibold">Role</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold text-center">Registered</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28 mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.doc?.employees && data.doc.employees.length > 0 ? (
                            data.doc.employees.map((employee: FarouqEmployee) => (
                                <TableRow 
                                    key={employee.employee_id}
                                    className="cursor-pointer hover:bg-muted/30 transition-all duration-200"
                                    onClick={() => router.push(`/farouq-employees/${employee.employee_id}`)}
                                >
                                    <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                                        {employee.employee_id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-foreground capitalize">
                                            {employee.full_name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5" />
                                            {employee.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="capitalize">{employee.department}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize text-sm">
                                        {employee.position}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Shield className={`h-3.5 w-3.5 ${employee.role === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'}`} />
                                            <span className={`text-xs font-semibold uppercase ${employee.role === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'}`}>
                                            {employee.role}
                                        </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(employee.status.toLowerCase())}
                                    </TableCell>
                                    <TableCell className="text-center text-sm text-muted-foreground">
                                        {moment(employee.date_registered).format("D MMM YYYY")}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                    {hasActiveFilters 
                                        ? "No employees found matching your filter criteria" 
                                        : "No employees found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {!isLoading && data?.doc?.employees && data.doc.employees.length > 0 && data.doc.pagination && (
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                <span className="font-medium">
                            {Math.min(startIndex + pageSize, data.doc.pagination.total)}
                                </span>{' '}
                        of <span className="font-medium">{data.doc.pagination.total}</span> employee{data.doc.pagination.total !== 1 ? 's' : ''}
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