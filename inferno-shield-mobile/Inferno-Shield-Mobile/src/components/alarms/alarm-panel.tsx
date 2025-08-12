
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Siren, BellOff, BellRing, Wifi, Dot } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { mockZones as initialAlarmZones } from '@/lib/mock-data';


type AlarmStatus = 'All Clear' | 'Fire Alarm Active' | 'Manual Alarm Active' | 'Silenced';

export function AlarmPanel() {
    const { toast } = useToast();
    const [status, setStatus] = useState<AlarmStatus>('All Clear');
    const [zones, setZones] = useState(initialAlarmZones.map(z => ({...z, status: 'Clear'})));
    const [connectivity, setConnectivity] = useState('Online');

    useEffect(() => {
        // Sync with the building map simulation
        const syncInterval = setInterval(() => {
            const criticalZoneEl = document.querySelector('.bg-destructive\\/80');
            const criticalZoneName = criticalZoneEl?.querySelector('p')?.textContent;
            
            if (criticalZoneName) {
                setStatus('Fire Alarm Active');
                setZones(prevZones => {
                    const newZones = [...prevZones];
                    const zoneIndex = newZones.findIndex(z => z.name === criticalZoneName);
                    if (zoneIndex !== -1) {
                        newZones.forEach((z, i) => newZones[i].status = 'Clear');
                        newZones[zoneIndex].status = 'Triggered';
                    }
                    return newZones;
                });
            } else if (status === 'Fire Alarm Active' ) {
                // If the alarm is active but no zone is critical, it means it's resetting
                setStatus('All Clear');
                setZones(initialAlarmZones.map(z => ({...z, status: 'Clear'})));
            }

        }, 500);


        return () => {
             clearInterval(syncInterval);
        };
    }, [status]);

    const handleManualTrigger = () => {
        setStatus('Manual Alarm Active');
        toast({
            title: "Manual Alarm Triggered",
            description: "The building-wide alarm has been manually activated.",
            variant: "destructive",
        });
    };
    
    const handleSilence = () => {
        setStatus('Silenced');
        toast({
            title: "Alarms Silenced",
            description: "Alarms have been temporarily silenced by an operator. This is not an all-clear.",
            variant: "default",
        });
    };
    
    const handleReset = () => {
        setStatus('All Clear');
        setZones(initialAlarmZones.map(z => ({...z, status: 'Clear'}))); // Manually reset zones
        // This will be picked up by the building map which should reset itself
        toast({
            title: "Alarms Reset",
            description: "The alarm system has been reset to 'All Clear'.",
            variant: "default",
        });
    };

    const getStatusInfo = () => {
        switch (status) {
            case 'Fire Alarm Active':
                return { icon: <Siren className="text-destructive animate-pulse h-6 w-6" />, label: 'Fire Alarm Active', description: 'Automatic fire detection has triggered the alarm.' };
            case 'Manual Alarm Active':
                return { icon: <Siren className="text-primary animate-pulse h-6 w-6" />, label: 'Manual Alarm Active', description: 'Alarm was manually triggered by an operator.' };
            case 'Silenced':
                return { icon: <BellOff className="text-accent h-6 w-6" />, label: 'Alarms Silenced', description: 'Audible alarms are paused. Visual strobes may still be active.' };
            default: // All Clear
                return { icon: <ShieldCheck className="text-green-500 h-6 w-6" />, label: 'All Clear', description: 'The alarm system is in a normal, ready state.' };
        }
    }

    const statusInfo = getStatusInfo();
    const isAlarmActive = status.includes('Active');

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Alarm System Control</CardTitle>
                <CardDescription>Monitor building-wide alarm status and take manual control when necessary.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                    <div className="flex items-center gap-4">
                        {statusInfo.icon}
                        <div>
                            <span className="font-semibold text-lg text-secondary-foreground">{statusInfo.label}</span>
                            <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Zone Status</h4>
                         <div className="border rounded-lg">
                            {zones.map((zone, index) => (
                               <div key={zone.id}>
                                 <div className="flex items-center justify-between p-3">
                                     <span className="font-medium">{zone.name}</span>
                                     <Badge variant={zone.status === 'Triggered' ? 'destructive' : 'secondary'}>
                                        {zone.status}
                                    </Badge>
                                 </div>
                                 {index < zones.length - 1 && <Separator />}
                               </div>
                            ))}
                         </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Connectivity Status</h4>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div className='flex items-center gap-2'>
                                 <Wifi className="h-5 w-5 text-muted-foreground" />
                                 <span className="font-medium">System Network</span>
                            </div>
                            <Badge variant={connectivity === 'Online' ? 'secondary' : 'destructive'}>{connectivity}</Badge>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isAlarmActive}>
                                <BellRing className="mr-2 h-4 w-4" />
                                Trigger Manual Alarm
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will trigger a building-wide alarm. This action should only be taken in a real emergency and will be logged.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleManualTrigger}>Confirm & Trigger</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" disabled={!isAlarmActive}>
                                <BellOff className="mr-2 h-4 w-4" />
                                Silence Alarms
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Silencing Alarms</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will silence audible alarms. Strobes will remain active. This is not an all-clear signal.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSilence}>Confirm & Silence</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button variant="secondary" onClick={handleReset} disabled={status === 'All Clear'}>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Reset to All Clear
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
