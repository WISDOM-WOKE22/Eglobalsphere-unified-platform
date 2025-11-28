import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useStore } from "@/lib/zustand/store"
import { renderLicensePlate } from "@/core/commons/utils"
import { Label } from "@/components/ui/label"
import { getStatusBadge } from "@/core/commons/components/badge/badge"

export const ViewLicensePlatesModal = () => {
    const { isLicensePlatesOpen, setIsLicensePlatesOpen } = useStore()
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
                        <p>{renderLicensePlate('٤٨٢-هـهـ_')}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-500">Vehicle Owner</Label>
                        <p>Guest</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-500">Vehicle Model</Label>
                        <p>Guest</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-500">Vehicle Owner</Label>
                        <p>Guest</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-500">Status</Label>
                        {getStatusBadge("active")}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-500">House No</Label>
                        <p>20 -21A</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}