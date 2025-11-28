import { BackButton } from "@/core/commons/navigation/backButton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs"
import { UserProfile, ActivitiesTab } from "../components/tabs"
import { SpherexEmployee } from "@/constants/spherex"

export const EmployeeLayout = () => {
    return (
        <main>
            <div className='flex flex-row justify-between mb-3'>
                <BackButton title="Employee profile" />
                <Button variant="destructive">Block Account</Button>
            </div>
            <Tabs defaultValue="profile">
                <TabsList className="w-65">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="activities">Activities</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <UserProfile user={SpherexEmployee[0]} />
                </TabsContent>
                <TabsContent value="activities">
                    <ActivitiesTab />
                </TabsContent>
            </Tabs>
        </main>
    )
}