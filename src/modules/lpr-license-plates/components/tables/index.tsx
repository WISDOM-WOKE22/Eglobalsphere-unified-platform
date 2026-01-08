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
import moment from "moment"
import { useStore } from "@/lib/zustand/store"
import { ViewLicensePlatesModal } from '../modals/viewLicensePlates'
import { ExportData } from "@/core/commons/dialogs"
import { useLPRLicensePlatesService } from "../../services"
import { Vehicle } from "@/types"

const ITEMS_PER_PAGE = 15

export const LicensePlateTable = () => {
    const { data, isLoading } = useLPRLicensePlatesService()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const { setIsLicensePlatesOpen, setSelectedVehicle } = useStore()

    // Filter license plates based on search term
    const filteredPlates = useMemo(() => {
        if (!data?.vehicles) return []
        if (!searchTerm) return data.vehicles
        const term = searchTerm.toLowerCase()
        return data.vehicles.filter(
            (plate: Vehicle) =>
                plate.license_plate.toLowerCase().includes(term) ||
                plate.vehicle_owner.toLowerCase().includes(term) ||
                plate.house_no.toLowerCase().includes(term) ||
                plate.vehicle_model.toLowerCase().includes(term)
        )
    }, [searchTerm, data?.vehicles])

    // Calculate pagination
    const totalPages = Math.ceil(filteredPlates.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedPlates = filteredPlates.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
                            <TableHead>Vehicle Model</TableHead>
                            <TableHead>House No</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Date added</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32 mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : paginatedPlates.length > 0 ? (
                            paginatedPlates.map((licensePlate: Vehicle) => (
                                <TableRow 
                                    key={licensePlate.id}
                                    onClick={() => {
                                        setIsLicensePlatesOpen(true)
                                        setSelectedVehicle(licensePlate)
                                    }}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <TableCell className="font-medium">
                                        {renderLicensePlate(licensePlate.license_plate)}
                                    </TableCell>
                                    <TableCell className="capitalize">{licensePlate.vehicle_owner}</TableCell>
                                    <TableCell>{licensePlate.vehicle_model}</TableCell>
                                    <TableCell>{licensePlate.house_no}</TableCell>
                                    <TableCell>{getStatusBadge(licensePlate.status)}</TableCell>
                                    <TableCell className="text-center">
                                        {moment(licensePlate.date_added).format("D MMM YYYY HH:mm")}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? `No license plates found matching "${searchTerm}"` : "No license plates found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {!isLoading && filteredPlates.length > 0 && (
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        {totalPages > 1 ? (
                            <>
                                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredPlates.length)}
                                </span>{' '}
                                of <span className="font-medium">{filteredPlates.length}</span> results
                                {searchTerm && data && ` (filtered from ${data.total} total)`}
                            </>
                        ) : (
                            <>
                                Showing <span className="font-medium">{filteredPlates.length}</span> result
                                {filteredPlates.length !== 1 ? 's' : ''}
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
            <ViewLicensePlatesModal />
        </Card>
    )
}