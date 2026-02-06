import ImageUpload from "@/core/commons/components/upload"
import { Separator } from "@radix-ui/react-separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCustomizationService } from "../../services"
import { Loader2 } from "lucide-react"
import { PreferenceLogoFormData, preferenceSchemaType } from "../schemas"
import { useEffect, useState } from "react"
import { useStore } from "@/lib/zustand/store"
import { toast } from "sonner"

export const PreferenceTab = () => {
    const { company } = useStore()
    const { 
        preferenceForm: {
            formState: { isSubmitting: isPreferenceSubmitting, errors },
            register,
            handleSubmit,
            reset: resetPreferenceForm,
        },
        updatePreference,
        preferenceLogoForm: {
            formState: { isSubmitting: isLogoSubmitting, errors: logoErrors },
            register: logoRegister,
            handleSubmit: logoHandleSubmit,
            watch,
            reset
        },
        preferenceLogoForm,
        updatePreferenceLogo,
     } = useCustomizationService()
    const [isEditing, setIsEditing] = useState(false)

    const handleUpdate = async (data: preferenceSchemaType) => {
        await updatePreference(data)
        setIsEditing(false)
    }

    const file = watch('file')

    const handleUpdateLogo = async (data: PreferenceLogoFormData) => {
        const selectedFile = data.file
        if (!(selectedFile instanceof File)) {
            toast.error("Please select a logo file to upload.")
            return
        }
        const formData = new FormData();
        formData.append('file', selectedFile)
        await updatePreferenceLogo(formData)
    }

    useEffect(() => {
        if (company) {
            reset({
                file: company?.company_logo ?? ""
            })
            resetPreferenceForm({
                company_name: company?.company_name ?? ""
            })
        }
    }, [company, reset, resetPreferenceForm])

    return (
        <div className="mt-4">
            <Separator />
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-lg font-semibold">Preference</h1>
                    <p className="text-sm text-muted-foreground">Manage company details and branding</p>
                </div>
                {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                resetPreferenceForm({ company_name: company?.company_name ?? "" })
                                setIsEditing(false)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit(handleUpdate)}
                            disabled={isPreferenceSubmitting}
                        >
                            {isPreferenceSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Save
                        </Button>
                    </div>
                )}
            </div>

            <form onSubmit={logoHandleSubmit(handleUpdateLogo)} className="mt-6">
                <input type="hidden" {...logoRegister("file")} />
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-5 items-start">
                        <ImageUpload
                            placeholder="Company Logo"
                            onChange={(file) => {
                                if (file) {
                                    preferenceLogoForm.setValue('file', file, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    })
                                }
                            }}
                            value={file}
                        />
                        <div className="flex flex-col gap-2">
                            <Button
                                type="submit"
                                className="w-fit"
                                disabled={isLogoSubmitting || !(file instanceof File)}
                            >
                                {isLogoSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Update Logo
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                JPG or PNG, max 5MB.
                            </p>
                            {logoErrors?.file?.message && (
                                <p className="text-red-500 text-xs">{logoErrors.file.message}</p>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            <form className="mt-6" onSubmit={handleSubmit(handleUpdate)}>
                <div className='grid sm:grid-cols-2 grid-cols-1 gap-5 border-t pt-5'>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Company Name</Label>
                        <Input
                            type="text"
                            id="company_name"
                            placeholder="Enter Company name"
                            disabled={!isEditing}
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