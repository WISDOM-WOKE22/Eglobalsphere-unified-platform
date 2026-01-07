import ImageUpload from "@/core/commons/components/upload"
import { Separator } from "@radix-ui/react-separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCustomizationService } from "../../services"
import { Loader2 } from "lucide-react"
import { preferenceSchemaType } from "../schemas"
import { useEffect } from "react"
import { useStore } from "@/lib/zustand/store"

export const PreferenceTab = () => {
    const { company } = useStore()
    const { 
        preferenceForm: {
            formState: { isSubmitting, errors },
            register,
            handleSubmit,
        },
        updatePreference,
        preferenceLogoForm: {
            formState: { errors: logoErrors },
            register: logoRegister,
            handleSubmit: logoHandleSubmit,
            watch,
            reset
        },
        preferenceLogoForm,
        updatePreferenceLogo,
     } = useCustomizationService()
    const handleUpdate = async (data: preferenceSchemaType) => {
        await updatePreference(data)
    }

    const file = watch('file')

    const handleUpdateLogo = async () => {
        const formData = new FormData();
        formData.append('file', file ?? "")
        await updatePreferenceLogo(formData)
    }

    useEffect(() => {
        if (company) {
            reset({
                file: company?.company_logo ?? ""
            })
        }
    }, [])

    return (
        <div className="mt-4">
            <Separator />
            <div className="flex justify-between border-b pb-4">
                <h1>Preference</h1>
            </div>
            <form onSubmit={handleSubmit(handleUpdate)} className="mt-4">
            <div className="mt-4 flex flex-row gap-5">
                <ImageUpload
                    placeholder="Company Logo"
                    onChange={(file) => {
                        if (file) {
                            preferenceLogoForm.setValue('file', file)
                        }
                    }}
                    value={file}

                />
            {/* <div className="flex flex-row items-center justify-end"> */}
                <Button type="button" className="w-fit" onClick={handleUpdateLogo} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" /> : 'Update Logo'}</Button>
            {/* </div> */}
            </div>
                </form>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <div className="flex flex-row items-center justify-end">
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" /> : 'update company details'}</Button>
                    </div>
                    <div  className='grid sm:grid-cols-2 grid-cols-1 gap-5 mt-5 border-t pt-5'>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Company Name</Label>
                        <Input
                            type="text"
                            id="company_name"
                            className="Company Name"
                            placeholder="Enter Company name"
                            { ...register('company_name') }
                        />
                        { errors.company_name && (
                            <p className="text-red-500 text-sm mt-1">
                                { errors.company_name.message }
                            </p>
                        )}
                    </div>
                    </div>
                </form>
            {/* </div> */}
        </div>
    )
}