import React from 'react';
import { DecisionType } from '@/types';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface DecisionBadgeProps {
  decision: DecisionType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function DecisionBadge({ decision, size = 'md', showIcon = true }: DecisionBadgeProps) {
  const configs = {
    TRUST: {
      label: 'TRUST',
      bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-emerald-500/10',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
    },
    VERIFY: {
      label: 'VERIFY',
      bg: 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-amber-500/10',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    ABSTAIN: {
      label: 'ABSTAIN',
      bg: 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-rose-500/10',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
    },
  };

  const config = configs[decision];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] space-x-1',
    md: 'px-2.5 py-1 text-xs space-x-1.5',
    lg: 'px-3.5 py-1.5 text-sm space-x-2 font-bold',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-mono font-bold tracking-wider uppercase border shadow-sm ${sizeClasses[size]} ${config.bg}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} ${config.iconColor}`} />}
      <span>{config.label}</span>
    </span>
  );
}
