import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Zone } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Flame, ShieldCheck, Thermometer, AlertTriangle } from 'lucide-react';

export function CurrentStatus({ zone }: { zone: Zone }) {
    const getStatusInfo = () => {
        switch (zone.status) {
            case 'critical':
                return {
                    icon: <Flame className="w-6 h-6 text-destructive" />,
                    label: 'Critical',
                    className: 'text-destructive',
                };
            case 'warning':
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-accent" />,
                    label: 'Warning',
                    className: 'text-accent',
                };
            default:
                return {
                    icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
                    label: 'Normal',
                    className: 'text-green-500',
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Live Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {statusInfo.icon}
                        <span className="font-medium">Overall Status</span>
                    </div>
                    <span className={cn('font-semibold text-lg', statusInfo.className)}>
                        {statusInfo.label}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Thermometer className="w-6 h-6 text-muted-foreground" />
                        <span className="font-medium">Temperature</span>
                    </div>
                    <span className="font-semibold text-lg">{zone.temp}°C</span>
                </div>
            </CardContent>
        </Card>
    );
}
