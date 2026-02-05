import { useState, useMemo, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { Search, X } from "lucide-react"
import moment from "moment"
// import { getStatusBadge } from "@/core/commons/components/badge/badge"
import { ExportData } from "@/core/commons/dialogs"
import { useLPRGatesService } from "../../services"
import { Gate } from "@/types"
import { getStatusBadge } from "@/core/commons/components/badge/badge"

const ITEMS_PER_PAGE = 20

export const LPRGatesTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchInput, setSearchInput] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    
    // Debounce search input - only trigger search after user stops typing for 500ms
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== searchTerm) {
                setSearchTerm(searchInput)
                setCurrentPage(1) // Reset to first page on new search
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchInput, searchTerm])
    
    // Build query parameters for server-side filtering and pagination
    const queryParams = useMemo(() => ({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        ...(searchTerm && { search: searchTerm }),
    }), [currentPage, searchTerm])

    const { data, isLoading } = useLPRGatesService(queryParams)
    
    // Sync current page with API response if available
    const actualPage = data?.page ?? currentPage
    
    // Calculate pagination from server data
    const totalPages = data?.total_pages ?? 0
    const pageSize = data?.page_size ?? ITEMS_PER_PAGE
    const startIndex = (actualPage - 1) * pageSize
    const currentPageItemCount = data?.gates?.length ?? 0
    const endIndex = startIndex + currentPageItemCount

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }

    // Clear search
    const handleClearSearch = useCallback(() => {
        setSearchInput("")
        setSearchTerm("")
        setCurrentPage(1)
    }, [])

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-10 pr-10"
                        placeholder="Search by gate name or project name..."
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                    {searchInput && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                            onClick={handleClearSearch}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <ExportData
                    title="Export data"
                    buttonTitle="Export data"
                    disabled={isLoading || !data?.gates || data.gates.length === 0}
                />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Gate Number</TableHead>
                            <TableHead>Project Name</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Access Type</TableHead>
                            <TableHead>Added By</TableHead>
                            {/* <TableHead>Status</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    {/* <TableCell><Skeleton className="h-6 w-20" /></TableCell> */}
                                </TableRow>
                            ))
                        ) : data?.gates && data.gates.length > 0 ? (
                            // Display actual data
                            data.gates.map((gate: Gate) => (
                                <TableRow key={gate.id} className="h-14">
                                    <TableCell className="font-medium">{gate.gate_name}</TableCell>
                                    <TableCell>{gate.project_name}</TableCell>
                                    <TableCell>
                                        {moment(gate.date_added).format("DD-MM-YYYY")}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(gate.access_type)}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={gate.added_by}>
                                        {gate.added_by}
                                    </TableCell>
                                    {/* <TableCell>{getStatusBadge(gate.status)}</TableCell> */}
                                </TableRow>
                            ))
                        ) : (
                            // Empty state
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <Search className="h-8 w-8 text-muted-foreground/50" />
                                        <p className="text-muted-foreground">
                                            {searchTerm 
                                                ? `No gates found matching "${searchTerm}"` 
                                                : "No gates found"}
                                        </p>
                                        {searchTerm && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleClearSearch}
                                                className="mt-2"
                                            >
                                                Clear search
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {!isLoading && data && data.gates && data.gates.length > 0 && (
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{endIndex}</span>{' '}
                        of <span className="font-medium">{data.total}</span> gate{data.total !== 1 ? 's' : ''}
                        {searchTerm && <span> matching &rdquo;{searchTerm}</span>}
                        {data.total_pages > 1 && ` (Page ${data.page} of ${data.total_pages})`}
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
                            {totalPages > 0 && (
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
                            )}

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