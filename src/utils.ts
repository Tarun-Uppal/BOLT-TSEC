import type { Product, ClaimStatus, WarrantyStatus } from './types';

export function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getWarrantyStatus(product: Product): WarrantyStatus {
  const days = daysUntil(product.warrantyExpiry);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring';
  if (product.extendedMonths > 0) return 'extended';
  return 'active';
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const statusConfig: Record<ClaimStatus, { label: string; color: string; bg: string; text: string; dot: string }> = {
  pending: { label: 'Pending', color: 'amber', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'under-review': { label: 'Under Review', color: 'sky', bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500' },
  approved: { label: 'Approved', color: 'brand', bg: 'bg-brand-100', text: 'text-brand-700', dot: 'bg-brand-500' },
  rejected: { label: 'Rejected', color: 'red', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  resolved: { label: 'Resolved', color: 'slate', bg: 'bg-slate-200', text: 'text-slate-700', dot: 'bg-slate-500' },
};

export const warrantyStatusConfig: Record<WarrantyStatus, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: 'Active', bg: 'bg-brand-100', text: 'text-brand-700', dot: 'bg-brand-500' },
  expiring: { label: 'Expiring Soon', bg: 'bg-accent-100', text: 'text-accent-700', dot: 'bg-accent-500' },
  expired: { label: 'Expired', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  extended: { label: 'Extended', bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500' },
};
