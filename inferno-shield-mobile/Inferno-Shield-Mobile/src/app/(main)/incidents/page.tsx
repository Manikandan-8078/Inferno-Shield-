
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { mockIncidents } from '@/lib/mock-data';
import type { Incident } from '@/lib/types';

export default function IncidentsPage() {
  const getSeverityBadge = (severity: Incident['severity']) => {
    switch (severity) {
      case 'Critical':
        return <Badge variant="destructive">{severity}</Badge>;
      case 'Moderate':
        return <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">{severity}</Badge>;
      case 'Minor':
        return <Badge variant="secondary">{severity}</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Details</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mockIncidents.map((incident) => (
                <TableRow key={incident.id}>
                    <TableCell className="font-medium">{incident.date}</TableCell>
                    <TableCell>{incident.location}</TableCell>
                    <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                    <TableCell>{incident.duration}</TableCell>
                    <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/incidents/${incident.id}`}>
                        <ArrowRight className="w-4 h-4" />
                        <span className="sr-only">View Details</span>
                        </Link>
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
