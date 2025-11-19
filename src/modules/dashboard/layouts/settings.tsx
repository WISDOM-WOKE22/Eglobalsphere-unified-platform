import { PreferenceSettings } from '../components/tabs/preference';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecuritySettings } from '../components/tabs/security';

export const Settings = () => {
  return (
    <Card className='px-4'>
      <Tabs defaultValue='security'>
        <TabsList defaultValue='preference'>
          <TabsTrigger value='preference'>Preference</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
        </TabsList>
        <TabsContent value='preference'>
          <PreferenceSettings />
        </TabsContent>
        <TabsContent value='security'>
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
