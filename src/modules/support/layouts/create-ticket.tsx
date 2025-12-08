import { BackButton } from "@/core/commons/navigation/backButton"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/core/commons/richTextEditor";

export const CreateTicketLayout = () => {
    return (
        <div>
            <Card className="px-4">
                <div className="flex w-full pb-5 border-b flex-row items-center justify-between">
                    <BackButton title="Back to Tickets" />
                    <Button>Create Ticket</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-3">
                        <Label>Select Service</Label>
                        <Select>
                            <SelectTrigger className='w-full h-15'>
                                <SelectValue placeholder='Select Service' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Spherex">
                                    Spherex
                                </SelectItem>
                                <SelectItem value="LPR">
                                    LPR
                                </SelectItem>
                                <SelectItem value="Farouq">
                                    Farouq
                                </SelectItem>
                                <SelectItem value="Spherex">
                                    Spherex
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Ticket Type</Label>
                        <Select>
                            <SelectTrigger className='w-full h-15'>
                                <SelectValue placeholder='Select Service' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Critical">
                                    Critical
                                </SelectItem>
                                <SelectItem value="Casual">
                                    Casual
                                </SelectItem>
                                <SelectItem value="Normal">
                                    Normal
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <main className='mt-5'>
                    <Label htmlFor='content' className='mb-2'>
                        Content
                    </Label>
                    <RichTextEditor className="h-40" />
                </main>
            </Card>
        </div>
    )
}