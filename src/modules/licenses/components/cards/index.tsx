import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const ServiceCard = () => {
    const services = [
        { name: "Spherex", description: "Real-time threat monitoring" },
        { name: "LPR", description: "Advanced security insights" },
        { name: "Vehicle Violation", description: "Automated defense systems" },
        { name: "Farouq Factories", description: "Automated defense systems" },
    ]

    return (
        <Card className="w-full max-w-[400px] py-10">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-500" />
              </div> */}
                        <CardTitle className="text-2xl font-semibold text-balance">Current Plan</CardTitle>
                    </div>
                    <Badge
                        variant="secondary"
                        className="h-6 px-3 text-xs font-medium bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
                    >
                        Active
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="border-t border-border/30 pt-6">
                    <h3 className="text-sm font-semibold text-foreground/70 mb-4 tracking-wide uppercase">Included Services</h3>

                    <div className="space-y-2">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="group flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 transition-all hover:bg-muted/50 hover:border-emerald-500/30 hover:shadow-sm"
                            >
                                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500/30 transition-colors">
                                    <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground leading-tight">{service.name}</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}