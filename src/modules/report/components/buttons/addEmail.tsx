import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Label } from "@/components/ui/label"

export const AddEmailButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex flex-row items-center gap-3">
                    <Plus />
                    <p>Add new email</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new email</DialogTitle>
                    <DialogDescription>
                        Add a new email to receive automated reports
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-6">
                    <div>
                        <Label>Email Address</Label>
                        <Input
                            type="email"
                            placeholder="Enter email address"
                        />
                    </div>
                    <div className="flex flex-row items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                        >
                            Add Email
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}