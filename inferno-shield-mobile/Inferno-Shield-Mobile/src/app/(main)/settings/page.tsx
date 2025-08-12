
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { EmergencyContacts } from '@/components/settings/emergency-contacts';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Emergency Contacts</CardTitle>
                    <CardDescription>Manage the list of contacts to be notified during an incident.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EmergencyContacts />
                </CardContent>
            </Card>
        </div>
    )
}
