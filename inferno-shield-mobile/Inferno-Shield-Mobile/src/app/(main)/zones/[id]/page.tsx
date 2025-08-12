
import { mockZones } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { SuppressionControls } from '@/components/dashboard/suppression-controls';
import { SensorStatus } from '@/components/dashboard/sensor-status';
import { LiveFeed } from '@/components/dashboard/live-feed';
import { CurrentStatus } from '@/components/zones/current-status';


export default function ZoneDetailPage({ params }: { params: { id: string } }) {
  const zone = mockZones.find((z) => z.id === params.id);

  if (!zone) {
    notFound();
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Zone Dashboard - {zone.name}</CardTitle>
                <CardDescription>
                    Live status and controls for this zone.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <SuppressionControls />
                    <LiveFeed />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <CurrentStatus zone={zone} />
                    <SensorStatus />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
