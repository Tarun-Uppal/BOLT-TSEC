import type { ClaimStatus, WarrantyStatus } from '../types';
import { statusConfig, warrantyStatusConfig } from '../utils';

export function ClaimStatusBadge({ status, size = 'md' }: { status: ClaimStatus; size?: 'sm' | 'md' }) {
  const cfg = statusConfig[status];
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${cfg.bg} ${cfg.text} ${pad}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function WarrantyStatusBadge({ status, size = 'md' }: { status: WarrantyStatus; size?: 'sm' | 'md' }) {
  const cfg = warrantyStatusConfig[status];
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${cfg.bg} ${cfg.text} ${pad}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
