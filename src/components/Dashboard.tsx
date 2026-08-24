import { useMemo } from 'react';
import type { Product, Claim, TabId } from '../types';
import { daysUntil, formatDate, getWarrantyStatus } from '../utils';
import { ProductIcon } from './icons';
import { ClaimStatusBadge, WarrantyStatusBadge } from './StatusBadge';
import { ShieldCheck, AlertTriangle, Clock, TrendingUp, ChevronRight, FileText, Package, CheckCircle2 } from 'lucide-react';

interface Props {
  products: Product[];
  claims: Claim[];
  onNavigate: (tab: TabId) => void;
}

export function Dashboard({ products, claims, onNavigate }: Props) {
  const stats = useMemo(() => {
    const active = products.filter((p) => {
      const s = getWarrantyStatus(p);
      return s === 'active' || s === 'extended';
    }).length;
    const expiring = products.filter((p) => getWarrantyStatus(p) === 'expiring').length;
    const expired = products.filter((p) => getWarrantyStatus(p) === 'expired').length;
    const openClaims = claims.filter((c) => c.status === 'pending' || c.status === 'under-review').length;
    const resolvedClaims = claims.filter((c) => c.status === 'resolved').length;
    return { active, expiring, expired, openClaims, totalDevices: products.length, resolvedClaims };
  }, [products, claims]);

  const upcomingExpirations = useMemo(() => {
    return [...products]
      .map((p) => ({ product: p, days: daysUntil(p.warrantyExpiry) }))
      .filter((x) => x.days >= 0)
      .sort((a, b) => a.days - b.days)
      .slice(0, 4);
  }, [products]);

  const recentClaims = useMemo(() => {
    return [...claims].sort((a, b) => b.updatedDate.localeCompare(a.updatedDate)).slice(0, 3);
  }, [claims]);

  return (
    <div className="space-y-5 animate-fade-in pb-4">
      {/* Hero summary */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-brand-400/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-brand-100 text-sm font-medium">
            <ShieldCheck className="h-4 w-4" />
            Devices under warranty
          </div>
          <p className="mt-1 text-4xl font-extrabold tracking-tight">{stats.totalDevices}</p>
          <div className="mt-4 flex gap-4">
            <div className="flex-1 rounded-2xl bg-white/15 backdrop-blur-sm p-3">
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-brand-100 mt-0.5">Active warranties</p>
            </div>
            <div className="flex-1 rounded-2xl bg-white/15 backdrop-blur-sm p-3">
              <p className="text-2xl font-bold">{stats.openClaims}</p>
              <p className="text-xs text-brand-100 mt-0.5">Open claims</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Clock} label="Expiring" value={stats.expiring} color="text-accent-600" bg="bg-accent-50" onClick={() => onNavigate('products')} />
        <StatCard icon={AlertTriangle} label="Expired" value={stats.expired} color="text-red-600" bg="bg-red-50" onClick={() => onNavigate('products')} />
        <StatCard icon={FileText} label="Total claims" value={claims.length} color="text-sky-600" bg="bg-sky-50" onClick={() => onNavigate('claims')} />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats.resolvedClaims} color="text-brand-600" bg="bg-brand-50" onClick={() => onNavigate('claims')} />
      </div>

      {/* Upcoming expirations */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">Upcoming expirations</h2>
          <button onClick={() => onNavigate('products')} className="text-sm font-semibold text-brand-600 flex items-center gap-0.5">
            View all <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
          {upcomingExpirations.map(({ product, days }) => (
            <button
              key={product.id}
              onClick={() => onNavigate('products')}
              className="w-full flex items-center gap-3 rounded-2xl bg-white border border-slate-100 p-3.5 text-left active:scale-[0.98] transition-transform shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                <ProductIcon name={product.icon} className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900 truncate">{product.name}</p>
                <p className="text-xs text-slate-500">{formatDate(product.warrantyExpiry)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${days <= 7 ? 'text-red-600' : days <= 30 ? 'text-accent-600' : 'text-slate-700'}`}>
                  {days === 0 ? 'Today' : `${days}d`}
                </p>
                <WarrantyStatusBadge status={getWarrantyStatus(product)} size="sm" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent claims */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">Recent claims</h2>
          <button onClick={() => onNavigate('claims')} className="text-sm font-semibold text-brand-600 flex items-center gap-0.5">
            View all <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
          {recentClaims.map((claim) => {
            const product = products.find((p) => p.id === claim.productId);
            return (
              <button
                key={claim.id}
                onClick={() => onNavigate('claims')}
                className="w-full flex items-center gap-3 rounded-2xl bg-white border border-slate-100 p-3.5 text-left active:scale-[0.98] transition-transform shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                  <ProductIcon name={claim.productIcon} className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">{claim.issue}</p>
                  <p className="text-xs text-slate-500 truncate">{claim.productName}</p>
                </div>
                <ClaimStatusBadge status={claim.status} size="sm" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Tip card */}
      <div className="rounded-2xl bg-gradient-to-br from-accent-50 to-amber-50 border border-accent-100 p-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-white">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Extend your coverage</p>
          <p className="text-xs text-slate-600 mt-0.5">{stats.expiring > 0 ? `${stats.expiring} warranties expiring soon — extend before they lapse.` : 'Keep your devices protected with extended warranty plans.'}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg, onClick }: { icon: typeof Package; label: string; value: number; color: string; bg: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-2xl bg-white border border-slate-100 p-3.5 text-left active:scale-[0.97] transition-transform shadow-sm">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} mb-2`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </button>
  );
}
