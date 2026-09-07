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
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
    },
    VERIFY: {
      label: 'VERIFY',
      bg: 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    ABSTAIN: {
      label: 'ABSTAIN',
      bg: 'bg-rose-50 text-rose-800 border-rose-300 shadow-2xs',
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
    },
  };

  const config = configs[decision] || configs.VERIFY;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] space-x-1 font-bold',
    md: 'px-2.5 py-1 text-xs space-x-1.5 font-bold',
    lg: 'px-3.5 py-1.5 text-sm space-x-2 font-bold',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg font-mono tracking-wider uppercase border ${sizeClasses[size]} ${config.bg}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} ${config.iconColor} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
}
