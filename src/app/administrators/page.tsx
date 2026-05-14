'use client';

import { BellRing, Lock, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import ModuleShowcasePage from '@/components/ModuleShowcasePage';

export default function AdministratorsPage() {
  return (
    <ModuleShowcasePage
      eyebrow="Governance"
      title="Administrators"
      description="An executive-style admin space for system controls, escalations, and policy-level oversight. It now feels like a real command surface instead of a placeholder."
      actionLabel="Policy controls active"
      slides={[
        {
          eyebrow: 'Control layer',
          title: 'Give administrators a workspace that matches their responsibility.',
          description: 'High-trust tasks need calmer interfaces, stronger hierarchy, and fewer visual distractions.',
          metric: '9',
          caption: 'Core admin checks surfaced in the redesigned flow.',
        },
        {
          eyebrow: 'Security',
          title: 'Highlight what needs review, not just what exists.',
          description: 'The new layout is oriented around risks, exceptions, and required approvals.',
          metric: '2 mins',
          caption: 'Target time to spot unusual access or workflow drift.',
        },
        {
          eyebrow: 'Consistency',
          title: 'Keep governance in the same visual language as the rest of the CRM.',
          description: 'Admin tools now feel integrated with daily operations rather than bolted on.',
          metric: 'Unified',
          caption: 'Navigation, spacing, and card patterns align with every page.',
        },
      ]}
      stats={[
        { label: 'Policy reviews', value: '05', caption: 'Pending governance checks' },
        { label: 'Active alerts', value: '02', caption: 'Need administrator attention' },
        { label: 'Role audits', value: '11', caption: 'Recently verified access profiles' },
      ]}
      cards={[
        {
          title: 'Access governance',
          description: 'Monitor privileged roles, review changes, and keep system authority clearly documented.',
          icon: Lock,
        },
        {
          title: 'Alert management',
          description: 'Surface unusual events, escalations, and policy exceptions in one clean lane.',
          icon: BellRing,
        },
        {
          title: 'Rule configuration',
          description: 'Present system-level controls in an organized, less intimidating structure.',
          icon: SlidersHorizontal,
        },
        {
          title: 'Audit posture',
          description: 'Make review-readiness visible with simple summaries and clearly grouped evidence.',
          icon: ShieldCheck,
        },
      ]}
      notes={[
        'Review privileged role changes first so access drift is visible before it becomes a compliance problem.',
        'Use alerts to drive admin attention, then move into configuration only after exceptions are contained.',
        'Keep audit posture visible so management can trust the platform during reviews and demonstrations.',
      ]}
    />
  );
}
