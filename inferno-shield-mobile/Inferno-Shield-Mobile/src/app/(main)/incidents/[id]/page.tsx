
import { mockIncidents } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SafetyRecommendations } from '@/components/incidents/safety-recommendations';

export function generateStaticParams() {
  return mockIncidents.map((incident) => ({
    id: incident.id,
  }));
}

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const incident = mockIncidents.find((i) => i.id === params.id);

  if (!incident) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Incident Details - {incident.id}</CardTitle>
          <CardDescription>
            {incident.date} at {incident.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Severity</p>
              <p>{incident.severity}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Duration</p>
              <p>{incident.duration}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <h4 className="font-semibold mb-2">Incident Log</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{incident.log}</p>
        </CardContent>
      </Card>

      <SafetyRecommendations incident={incident} />
    </div>
  );
}
