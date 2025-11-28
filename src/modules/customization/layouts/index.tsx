import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PreferenceTab } from "../components/tabs/preference";
import { CustomizationTab } from "../components/tabs/customization";

export const CustomizationLayout = () => {
    return (
        <Card className="px-4">
            <Tabs defaultValue="preference">
                <TabsList>
                    <TabsTrigger value="preference">Preference</TabsTrigger>
                    <TabsTrigger value="customization">Customization</TabsTrigger>
                </TabsList>
                <TabsContent value="preference">
                    <PreferenceTab />
                </TabsContent>
                <TabsContent value="customization">
                    <CustomizationTab />
                </TabsContent>
            </Tabs>
        </Card>
    )
}