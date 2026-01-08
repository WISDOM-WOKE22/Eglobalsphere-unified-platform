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
import moment from "moment"
import { useRouter } from "next/navigation"
import { ExportData } from "@/core/commons/dialogs"
import { useFarouqEmployeeService } from "../../services"
import { FarouqEmployee } from "@/types"

const ITEMS_PER_PAGE = 10

export const FarouqEmployeeTable = () => {
    const router = useRouter()
    const { data, isLoading } = useFarouqEmployeeService()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")

    // Filter employees based on search term
    const filteredEmployees = useMemo(() => {
        if (!data?.doc?.employees) return []
        if (!searchTerm) return data.doc.employees
        const term = searchTerm.toLowerCase()
        return data.doc.employees.filter(
            (employee: FarouqEmployee) =>
                employee.full_name.toLowerCase().includes(term) ||
                employee.email.toLowerCase().includes(term) ||
                employee.employee_id.toLowerCase().includes(term) ||
                employee.department.toLowerCase().includes(term) ||
                employee.position.toLowerCase().includes(term) ||
                employee.role.toLowerCase().includes(term)
        )
    }, [searchTerm, data?.doc?.employees])

    // Calculate pagination
    const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
                    placeholder="Search by name, email, department, or ID"
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
                            <TableHead>Employee ID</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Date Registered</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28 mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : paginatedEmployees.length > 0 ? (
                            paginatedEmployees.map((employee: FarouqEmployee) => (
                                <TableRow 
                                    key={employee.employee_id}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => router.push(`/farouq-employees/${employee.employee_id}`)}
                                >
                                    <TableCell className="font-medium">{employee.employee_id.slice(0, 8)}...</TableCell>
                                    <TableCell className="capitalize">{employee.full_name}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell className="capitalize">{employee.department}</TableCell>
                                    <TableCell className="capitalize">{employee.position}</TableCell>
                                    <TableCell className="uppercase text-xs font-semibold">
                                        <span className={employee.role === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'}>
                                            {employee.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(employee.status.toLowerCase())}</TableCell>
                                    <TableCell className="text-center">{moment(employee.date_registered).format("D MMM YYYY")}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? `No employees found matching "${searchTerm}"` : "No employees found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {!isLoading && filteredEmployees.length > 0 && (
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        {totalPages > 1 ? (
                            <>
                                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredEmployees.length)}
                                </span>{' '}
                                of <span className="font-medium">{filteredEmployees.length}</span> results
                                {searchTerm && data?.doc?.pagination && ` (filtered from ${data.doc.pagination.total} total)`}
                            </>
                        ) : (
                            <>
                                Showing <span className="font-medium">{filteredEmployees.length}</span> result
                                {filteredEmployees.length !== 1 ? 's' : ''}
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