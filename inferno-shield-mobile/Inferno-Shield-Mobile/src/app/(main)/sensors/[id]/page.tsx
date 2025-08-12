
import { mockSensorDetails } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { SensorDetail } from '@/components/sensors/sensor-detail';
import { mockZones } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


export default function SensorDetailPage({ params }: { params: { id: string } }) {
  const sensorId = params.id.toLowerCase();
  const sensor = mockSensorDetails[sensorId];

  if (!sensor) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Triggered':
            return <Badge variant="destructive">{status}</Badge>;
        case 'Warning':
            return <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">{status}</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <SensorDetail sensor={sensor} />
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Zone Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockZones.map(zone => {
                            const zoneSensor = zone.sensors.find(s => s.name.toLowerCase() === sensorId);
                            return (
                                <Link href={`/zones/${zone.id}`} key={zone.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary">
                                    <span className="font-medium">{zone.name}</span>
                                    {zoneSensor && getStatusBadge(zoneSensor.status)}
                                </Link>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
