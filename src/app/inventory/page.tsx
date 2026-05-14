'use client';

import { BarChart3, Boxes, Building2, TimerReset } from 'lucide-react';
import ModuleShowcasePage from '@/components/ModuleShowcasePage';

export default function InventoryPage() {
  return (
    <ModuleShowcasePage
      eyebrow="Stock operations"
      title="Inventory"
      description="A cleaner inventory workspace for teams who need to watch availability, launch pressure, and project readiness without digging through clutter."
      actionLabel="Live stock readiness"
      stats={[
        { label: 'Launch-ready', value: '28', caption: 'Units immediately promotable' },
        { label: 'Low stock', value: '06', caption: 'Projects nearing sell-through' },
        { label: 'Reserved', value: '14', caption: 'Inventory already committed' },
      ]}
      cards={[
        {
          title: 'Project availability',
          description: 'Summaries by development or tower, with clear visual emphasis on healthy versus constrained stock.',
          icon: Building2,
        },
        {
          title: 'Release pacing',
          description: 'Track how quickly fresh inventory is moving and where campaigns may need support.',
          icon: TimerReset,
        },
        {
          title: 'Commercial mix',
          description: 'Review premium, mid-tier, and high-velocity stock categories without opening separate screens.',
          icon: Boxes,
        },
        {
          title: 'Trend analysis',
          description: 'Use quick signals to understand whether availability is stabilizing or tightening.',
          icon: BarChart3,
        },
      ]}
      notes={[
        'Start with low-stock projects to protect campaign promises and avoid overexposure.',
        'Use release pacing blocks to align sales pushes with actual inventory readiness.',
        'Keep commercial mix visible so operators can reposition attention when premium stock slows.',
      ]}
    />
  );
}
