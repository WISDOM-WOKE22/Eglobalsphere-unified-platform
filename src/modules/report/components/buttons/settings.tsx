import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { settingsTime, reportDays } from "@/constants/settings"
import { useState } from "react"

export const SettingsButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex flex-row items-center gap-3 pl-2 py-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <p>Settings</p>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Configure automated report delivery settings.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label>Report Frequency</Label>
                        <Select>
                            <SelectTrigger
                                className="w-full"
                            >
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Day</Label>
                        <Select
                        >
                            <SelectTrigger
                                className="w-full"
                            >
                                <SelectValue placeholder="Select day"
                                    className="w-full"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {reportDays.map(day => (
                                    <SelectItem key={day.value} value={day.value}>
                                        {day.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Time</Label>
                        <Select>
                            <SelectTrigger
                                className="w-full"
                            >
                                <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                                {settingsTime.map(time => (
                                    <SelectItem key={time.value} value={time.value}>
                                        {time.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button>
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}