import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useStore } from "@/lib/zustand/store"
import { renderLicensePlate } from "@/core/commons/utils"
import { Label } from "@/components/ui/label"
import { getStatusBadge } from "@/core/commons/components/badge/badge"

export const ViewLicensePlatesModal = () => {
    const { isLicensePlatesOpen, setIsLicensePlatesOpen, selectedVehicle } = useStore()
    return (
        <Dialog open={isLicensePlatesOpen} onOpenChange={(open) => setIsLicensePlatesOpen(open)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>View License Plates</DialogTitle>
                    <DialogDescription>
                        View license plates
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-500">License Plate</Label>
                        <p>{renderLicensePlate(selectedVehicle?.license_plate || '')}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-500">Vehicle Owner</Label>
                        <p>{selectedVehicle?.vehicle_owner || ''}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-500">Vehicle Model</Label>
                        <p>{selectedVehicle?.vehicle_model || ''}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-500">Vehicle Owner</Label>
                        <p>{selectedVehicle?.vehicle_owner || ''}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-500">Status</Label>
                        {getStatusBadge(selectedVehicle?.status || 'inactive')}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-500">House No</Label>
                        <p>{selectedVehicle?.house_no || ''}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}