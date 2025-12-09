import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getStatusBadge } from "@/core/commons/components/badge/badge"

interface ViewTicketModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ticket: any; // Using any for now as I don't have the exact type definition handy, but will infer from usage
}

export function ViewTicketModal({ open, onOpenChange, ticket }: ViewTicketModalProps) {
    if (!ticket) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <DialogTitle className="text-xl font-semibold">Ticket Details</DialogTitle>
                        {getStatusBadge(ticket.status)}
                    </div>
                    <DialogDescription>
                        View the details of the support ticket.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Ticket ID</h4>
                            <p className="text-sm font-medium">{ticket.id}</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
                            <p className="text-sm">{new Date(ticket.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Sent By</h4>
                            <p className="text-sm">{ticket.sentBy}</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Service</h4>
                            <p className="text-sm">{ticket.service || "N/A"}</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Title</h4>
                        <p className="text-base font-semibold">{ticket.title}</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                        <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-muted/50">
                            <div className="text-sm leading-relaxed">
                                {ticket.description}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
