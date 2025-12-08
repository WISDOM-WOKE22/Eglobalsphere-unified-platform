import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { farouqEmployees } from "@/constants/farouq"
import { useRouter } from "next/navigation"
import { ExportData } from "@/core/commons/dialogs"

const ITEMS_PER_PAGE = 15

export const FarouqEmployeeTable = () => {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")

    // Filter employees based on search term
    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return farouqEmployees
        const term = searchTerm.toLowerCase()
        return farouqEmployees.filter(
            (employee) =>
                employee.first_name.toLowerCase().includes(term) ||
                employee.last_name.toLowerCase().includes(term) ||
                employee.email.toLowerCase().includes(term) ||
                employee.employee_id.toLowerCase().includes(term) ||
                (employee.phone && employee.phone.toLowerCase().includes(term)) ||
                (employee.department && employee.department.toLowerCase().includes(term))
        )
    }, [searchTerm])

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
                        {paginatedEmployees.length > 0 ? (
                            paginatedEmployees.map((employee, index) => (
                                <TableRow key={employee.id || index}
                                    className="cursor-pointer"
                                    onClick={() => router.push(`/farouq-employees/${employee.id}`)}
                                >
                                    <TableCell className="font-medium">{employee.employee_id}</TableCell>
                                    <TableCell className="capitalize">{`${employee.first_name} ${employee.last_name}`}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell className="capitalize">{employee.department || "N/A"}</TableCell>
                                    <TableCell>{employee.position || "N/A"}</TableCell>
                                    <TableCell className="uppercase">{employee.role}</TableCell>
                                    <TableCell>{getStatusBadge(employee.status.toLowerCase())}</TableCell>
                                    <TableCell className="text-center">{moment(employee.created_at).format("D MMM YYYY HH:mm")}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-4">
                                    No employees found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {totalPages > 1 && (
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">
                            {Math.min(startIndex + ITEMS_PER_PAGE, filteredEmployees.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredEmployees.length}</span> results
                    </div>
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
                </CardFooter>
            )}
        </Card>
    )
}