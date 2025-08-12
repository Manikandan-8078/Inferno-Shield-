
'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { SensorDetail } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Thermometer, Wind, Beaker, Zap, RadioTower, Image as ImageIcon, AlertTriangle, ShieldCheck, Wifi, Bluetooth } from 'lucide-react';

const iconMap = {
    Thermal: Thermometer,
    Smoke: Wind,
    Chemical: Beaker,
    Electrical: Zap,
    Motion: RadioTower,
    Image: ImageIcon,
    WiFi: Wifi,
    Bluetooth: Bluetooth
};

export function SensorDetail({ sensor }: { sensor: SensorDetail }) {
    const Icon = iconMap[sensor.type as keyof typeof iconMap];

    const getStatusInfo = () => {
        switch (sensor.status) {
            case 'Triggered':
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-destructive" />,
                    label: 'Triggered',
                    className: 'text-destructive',
                    badge: <Badge variant="destructive">Triggered</Badge>
                };
            case 'Warning':
                 return {
                    icon: <AlertTriangle className="w-6 h-6 text-accent" />,
                    label: 'Warning',
                    className: 'text-accent',
                    badge: <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">Warning</Badge>
                };
            default:
                return {
                    icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
                    label: 'Active',
                    className: 'text-green-500',
                    badge: <Badge variant="secondary">Active</Badge>
                };
        }
    }

    const statusInfo = getStatusInfo();


  return (
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-8 h-8 text-muted-foreground" />}
                    <div>
                        <CardTitle className="text-2xl">{sensor.type} Sensor Details</CardTitle>
                        <CardDescription>ID: {sensor.id}</CardDescription>
                    </div>
                </div>
                 {statusInfo.badge}
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <p className="font-medium text-muted-foreground">Status</p>
                    <p className={cn("font-semibold", statusInfo.className)}>{statusInfo.label}</p>
                </div>
                <div>
                    <p className="font-medium text-muted-foreground">Last Check-in</p>
                    <p>{sensor.lastCheckIn}</p>
                </div>
                 <div>
                    <p className="font-medium text-muted-foreground">Operational Since</p>
                    <p>{sensor.operationalSince}</p>
                </div>
            </div>
            <div>
                 <h4 className="font-semibold mb-2">Live Reading</h4>
                 <div className="text-4xl font-bold">{sensor.currentReading.value} <span className="text-lg font-normal text-muted-foreground">{sensor.currentReading.unit}</span></div>
            </div>
            <div>
                <h4 className="font-semibold mb-2">Recent Activity (Last 24 Hours)</h4>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sensor.history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit={sensor.currentReading.unit} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                }}
                            />
                            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
