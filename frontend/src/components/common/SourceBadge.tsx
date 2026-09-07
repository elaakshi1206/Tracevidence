import React from 'react';
import { SourceTier } from '@/types';
import { GraduationCap, Landmark, Award, Newspaper, Layers, HelpCircle } from 'lucide-react';

interface SourceBadgeProps {
  tier: SourceTier;
  size?: 'sm' | 'md';
}

export default function SourceBadge({ tier, size = 'md' }: SourceBadgeProps) {
  const configs: Record<SourceTier, { label: string; bg: string; icon: any }> = {
    Academic: {
      label: 'Academic / Peer-Reviewed',
      bg: 'bg-purple-950/70 text-purple-300 border-purple-500/40',
      icon: GraduationCap,
    },
    Government: {
      label: 'Government Authority',
      bg: 'bg-blue-950/70 text-blue-300 border-blue-500/40',
      icon: Landmark,
    },
    Official: {
      label: 'Official Body / Standard',
      bg: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40',
      icon: Award,
    },
    'Reputable Media': {
      label: 'Reputable Media',
      bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
      icon: Newspaper,
    },
    'Aggregator/Blog': {
      label: 'Aggregator / Blog Wire',
      bg: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
      icon: Layers,
    },
    Unverified: {
      label: 'Unverified / Forum',
      bg: 'bg-rose-950/70 text-rose-300 border-rose-500/40',
      icon: HelpCircle,
    },
  };

  const config = configs[tier] || configs.Unverified;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px] space-x-1',
    md: 'px-2 py-0.5 text-xs space-x-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium border ${sizeClasses[size]} ${config.bg}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span className="truncate">{config.label}</span>
    </span>
  );
}
