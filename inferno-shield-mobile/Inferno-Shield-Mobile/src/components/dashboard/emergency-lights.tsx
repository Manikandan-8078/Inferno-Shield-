
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { BatteryCharging, Battery, AlertTriangle, WandSparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type LightStatus = 'Charged' | 'Active' | 'Testing' | 'Fault';

export function EmergencyLights() {
    const { toast } = useToast();
    const [status, setStatus] = useState<LightStatus>('Charged');
    const [charge, setCharge] = useState(100);

    useEffect(() => {
        // Simulate fire event activation
        const timer = setTimeout(() => {
            setStatus('Active');
        }, 4000);

        // Simulate charge depletion while active
        let chargeInterval: NodeJS.Timeout;
        if (status === 'Active') {
            chargeInterval = setInterval(() => {
                setCharge((prev) => Math.max(prev - 1, 85));
            }, 1000);
        }

        return () => {
            clearTimeout(timer);
            if (chargeInterval) {
                clearInterval(chargeInterval);
            }
        };
    }, [status]);


    const handleTest = () => {
        if (status !== 'Charged') {
            toast({
                title: 'Test Blocked',
                description: `Cannot start test while system is ${status.toLowerCase()}.`,
                variant: 'destructive'
            });
            return;
        }

        setStatus('Testing');
        toast({
            title: 'Emergency Light Test Initiated',
            description: 'The system test will run for 15 seconds.'
        });

        setTimeout(() => {
            setStatus('Charged');
            toast({
                title: 'Test Complete',
                description: 'Emergency light system is fully operational.'
            });
        }, 15000); // 15 second test
    }
    
    const getStatusInfo = () => {
        switch (status) {
            case 'Active':
                return { icon: <Battery className="text-primary animate-pulse h-6 w-6" />, label: 'Active - Building Power Lost' };
            case 'Testing':
                return { icon: <WandSparkles className="text-accent h-6 w-6" />, label: 'System Self-Test in Progress...' };
            case 'Fault':
                return { icon: <AlertTriangle className="text-destructive h-6 w-6" />, label: 'System Fault Detected' };
            default: // Charged
                return { icon: <BatteryCharging className="text-green-500 h-6 w-6" />, label: 'Fully Charged & Ready' };
        }
    }

    const statusInfo = getStatusInfo();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Emergency Lights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                    <div className="flex items-center gap-4">
                        {statusInfo.icon}
                        <span className="font-semibold text-lg text-secondary-foreground">{statusInfo.label}</span>
                    </div>
                </div>
                <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-muted-foreground">Battery Level</span>
                        <span className="font-bold text-lg">{charge}%</span>
                    </div>
                    <Progress value={charge} className="h-3" />
                </div>
                <Button onClick={handleTest} disabled={status !== 'Charged'} className="w-full">
                    <WandSparkles className="mr-2 h-4 w-4" />
                    Initiate System Test
                </Button>
            </CardContent>
        </Card>
    )
}
