import ImageUpload from "@/core/commons/components/upload"
import { Separator } from "@radix-ui/react-separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const PreferenceTab = () => {
    return (
        <div className="mt-4">
            <Separator />
            <div className="flex justify-between border-b pb-4">
                <h1>Preference</h1>
                <Button>Update</Button>
            </div>
            <div className="mt-4 flex flex-col gap-5">
                <ImageUpload
                    placeholder="Company Logo"
                />

                <div className='grid sm:grid-cols-2 grid-cols-1 gap-5 mt-5 border-t pt-5'>
                    <div className="flex flex-col gap-3">
                        <Label>Company Name</Label>
                        <Input
                            className="Company Name"
                            placeholder="Enter Company name"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}