/**
 * WEEK 1: STATUS BADGE COMPONENTS
 * Color-coded status indicators with progress support
 *
 * Usage:
 * import { StatusBadge, StatusCard } from '@/components/StatusBadge'
 */

import React from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/20/solid';

export type StatusType = 'active' | 'closed' | 'pending' | 'at-risk' | 'failed';

interface StatusConfig {
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
  defaultLabel: string;
  ariaLabel: string;
}

const statusConfig: Record<StatusType, StatusConfig> = {
  active: {
    bgColor: 'bg-[#ecfdf5]',
    textColor: 'text-[#065f46]',
    icon: <CheckCircleIcon className="w-4 h-4" />,
    defaultLabel: '✓ ACTIVE',
    ariaLabel: 'Status: Active',
  },
  closed: {
    bgColor: 'bg-[#ecfdf5]',
    textColor: 'text-[#065f46]',
    icon: <CheckCircleIcon className="w-4 h-4" />,
    defaultLabel: '✓ CLOSED',
    ariaLabel: 'Status: Closed',
  },
  pending: {
    bgColor: 'bg-[#dbeafe]',
    textColor: 'text-[#0c4a6e]',
    icon: <ClockIcon className="w-4 h-4" />,
    defaultLabel: '⏳ PENDING',
    ariaLabel: 'Status: Pending',
  },
  'at-risk': {
    bgColor: 'bg-[#fffbeb]',
    textColor: 'text-[#92400e]',
    icon: <ExclamationTriangleIcon className="w-4 h-4" />,
    defaultLabel: '⚠ AT RISK',
    ariaLabel: 'Status: At Risk',
  },
  failed: {
    bgColor: 'bg-[#fef2f2]',
    textColor: 'text-[#7f1d1d]',
    icon: <XCircleIcon className="w-4 h-4" />,
    defaultLabel: '✗ FAILED',
    ariaLabel: 'Status: Failed',
  },
};

// ============================================
// STATUS BADGE COMPONENT
// ============================================

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  progress?: number; // 0-100
  className?: string;
}

export function StatusBadge({
  status,
  label,
  progress,
  className = '',
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.defaultLabel;

  return (
    <div
      role="status"
      aria-label={config.ariaLabel}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.icon}
      <span>{displayLabel}</span>

      {progress !== undefined && (
        <div className="ml-2">
          <div className="w-16 h-1.5 bg-current bg-opacity-20 rounded-full overflow-hidden">
            <div
              className="h-full bg-current transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// STATUS CARD COMPONENT
// ============================================

export interface StatusCardProps {
  status: StatusType;
  title?: string;
  description?: string;
  items?: string[];
  progress?: number;
  className?: string;
}

export function StatusCard({
  status,
  title,
  description,
  items,
  progress,
  className = '',
}: StatusCardProps) {
  const config = statusConfig[status];

  return (
    <div
      className={`p-6 rounded-lg border-l-4 ${config.bgColor} border-current ${className}`}
    >
      <div className={`flex items-center gap-3 mb-2 ${config.textColor}`}>
        {config.icon}
        <h3 className="font-bold text-lg">{title || config.defaultLabel}</h3>
      </div>

      {description && (
        <p className={`text-sm ${config.textColor} mb-3`}>{description}</p>
      )}

      {items && items.length > 0 && (
        <ul className={`text-sm space-y-2 mb-3 ${config.textColor}`}>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold">Progress</span>
            <span className="text-xs font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-current bg-opacity-20 rounded-full overflow-hidden">
            <div
              className="h-full bg-current transition-all"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * USAGE EXAMPLES:
 *
 * import { StatusBadge, StatusCard } from '@/components/StatusBadge'
 *
 * // Simple badge
 * <StatusBadge status="active" />
 *
 * // Badge with progress
 * <StatusBadge status="pending" progress={65} />
 *
 * // Card with details
 * <StatusCard
 *   status="at-risk"
 *   title="Deal Financing"
 *   description="Awaiting final approval from lenders"
 *   items={[
 *     'Documentation submitted',
 *     'Credit review in progress',
 *     'Expected decision: June 15'
 *   ]}
 *   progress={45}
 * />
 */
