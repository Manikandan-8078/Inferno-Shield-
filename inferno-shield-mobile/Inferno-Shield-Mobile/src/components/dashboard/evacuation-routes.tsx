
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AlertTriangle, MapPin, Milestone } from 'lucide-react';

interface EvacuationRoutesProps {
    criticalZoneId: string;
}

const evacuationPlans: Record<string, { title: string; steps: string[] }> = {
    'zone-1': {
        title: 'Lobby Fire',
        steps: [
            "Exit via main entrance doors.",
            "Assemble across the street at the designated meeting point.",
            "Do not re-enter the building.",
        ]
    },
    'zone-2': {
        title: 'Office A Fire',
        steps: [
            "Exit Office A, turn right.",
            "Proceed to emergency EXIT B.",
            "Use stairs, not the elevator.",
        ]
    },
     'zone-3': {
        title: 'Office B Fire',
        steps: [
            "Exit Office B, turn left.",
            "Proceed to emergency EXIT A.",
            "Use stairs, not the elevator.",
        ]
    },
    'zone-4': {
        title: 'Server Room Fire',
        steps: [
            "Exit Server Room, turn left.",
            "Proceed down the main corridor.",
            "Evacuate via EXIT A at the end of the hall.",
            "Secondary Route: Turn right, proceed to EXIT B.",
        ]
    },
     'zone-5': {
        title: 'Kitchen Fire',
        steps: [
            "Exit the kitchen, turn right toward the main lobby.",
            "Evacuate via the main entrance doors.",
            "Avoid the service corridor.",
        ]
    },
     'zone-6': {
        title: 'Warehouse Fire',
        steps: [
            "Evacuate via the large bay doors at the rear of the warehouse.",
            "Proceed to the West assembly point.",
            "Stay clear of loading docks.",
        ]
    },
    'default': {
        title: 'General Evacuation',
        steps: [
            "Proceed to the nearest marked exit.",
            "Listen for announcements from building staff.",
            "Do not use elevators.",
        ]
    }
}

export function EvacuationRoutes({ criticalZoneId }: EvacuationRoutesProps) {
    const plan = evacuationPlans[criticalZoneId] || evacuationPlans['default'];

    return (
        <Card className="border-destructive bg-destructive/5">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                    <div>
                        <CardTitle className="text-destructive">Evacuation Route Activated</CardTitle>
                        <CardDescription className="text-destructive/80">Follow these instructions for safe egress.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-destructive" />
                        <h4 className="font-semibold">Plan for: {plan.title}</h4>
                    </div>
                    <ul className="space-y-3 pl-5">
                        {plan.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Milestone className="h-5 w-5 mt-1 text-destructive flex-shrink-0" />
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
