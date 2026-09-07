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
      bg: 'bg-emerald-950/90 text-emerald-200 border-emerald-400/60 shadow-emerald-500/20',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
    },
    VERIFY: {
      label: 'VERIFY',
      bg: 'bg-amber-950/90 text-amber-200 border-amber-400/60 shadow-amber-500/20',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    ABSTAIN: {
      label: 'ABSTAIN',
      bg: 'bg-rose-950/90 text-rose-200 border-rose-400/60 shadow-rose-500/20',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
    },
  };

  const config = configs[decision] || configs.VERIFY;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs space-x-1.5 font-bold',
    md: 'px-3 py-1.5 text-sm space-x-2 font-bold',
    lg: 'px-4 py-2 text-base space-x-2.5 font-extrabold',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg font-mono tracking-wider uppercase border shadow-md ${sizeClasses[size]} ${config.bg}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} ${config.iconColor} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
}
