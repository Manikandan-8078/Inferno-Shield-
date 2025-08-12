
import { BuildingMap } from '@/components/dashboard/building-map';
import { LiveFeed } from '@/components/dashboard/live-feed';
import { SensorStatus } from '@/components/dashboard/sensor-status';
import { SuppressionControls } from '@/components/dashboard/suppression-controls';

export default function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <BuildingMap />
        <SuppressionControls />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <SensorStatus />
        <LiveFeed />
      </div>
    </div>
  );
}
