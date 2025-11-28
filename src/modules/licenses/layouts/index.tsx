import { Card } from "@/components/ui/card"
import { ServiceCard } from "../components/cards"

export const LicenseLayout = () => {
    return (
        <div>
            <h1>LicenseLayout</h1>
            <Card>
                <div className="flex flex-row justify-between px-5 border-b pb-4">
                    <div className="flex flex-row gap-2">
                        <h1>License Key:</h1>
                        <h1 className="text-green-500">************</h1>
                    </div>
                    <div className="flex flex-row gap-2">
                        <h1>Issued Date:</h1>
                        <h1 className="text-green-500"> 14th October, 2024</h1>
                    </div>
                    <div className="flex flex-row gap-2">
                        <h1>Expirary Date:</h1>
                        <h1 className="text-green-500"> 14th October, 2024</h1>
                    </div>
                </div>

                <div className="flex flex-row justify-center py-5">
                    <ServiceCard />
                </div>
            </Card>
        </div>
    )
}