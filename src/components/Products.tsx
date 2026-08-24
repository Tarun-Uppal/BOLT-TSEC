import { useState, useMemo } from 'react';
import type { Product, ExtensionPlan } from '../types';
import { daysUntil, formatDate, getWarrantyStatus, warrantyStatusConfig } from '../utils';
import { ProductIcon } from './icons';
import { WarrantyStatusBadge } from './StatusBadge';
import { extensionPlans } from '../data';
import { Search, X, ShieldPlus, Check, ChevronRight, Calendar, Store, Hash, Package } from 'lucide-react';

interface Props {
  products: Product[];
  onExtend: (product: Product, plan: ExtensionPlan) => void;
}

export function Products({ products, onExtend }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'expired' | 'extended'>('all');
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products
      .filter((p) => statusFilter === 'all' || getWarrantyStatus(p) === statusFilter)
      .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => daysUntil(a.warrantyExpiry) - daysUntil(b.warrantyExpiry));
  }, [products, search, statusFilter]);

  const filterChips: { id: typeof statusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'expiring', label: 'Expiring' },
    { id: 'extended', label: 'Extended' },
    { id: 'expired', label: 'Expired' },
  ];

  return (
    <div className="animate-fade-in pb-4">
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products or brands..."
          className="w-full rounded-2xl bg-white border border-slate-200 pl-10 pr-4 py-3 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 mb-4">
        {filterChips.map((f) => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              statusFilter === f.id ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
            <Package className="h-7 w-7 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((product) => {
            const status = getWarrantyStatus(product);
            const days = daysUntil(product.warrantyExpiry);
            const totalMonths = product.originalWarrantyMonths + product.extendedMonths;
            return (
              <button
                key={product.id}
                onClick={() => setSelected(product)}
                className="w-full text-left rounded-2xl bg-white border border-slate-100 p-4 active:scale-[0.98] transition-transform shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                    <ProductIcon name={product.icon} className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.brand} · {product.category}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-2 mt-2.5">
                      <WarrantyStatusBadge status={status} size="sm" />
                      {product.extendedMonths > 0 && (
                        <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                          +{product.extendedMonths}mo extended
                        </span>
                      )}
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{totalMonths}mo total coverage</span>
                        <span>{days < 0 ? 'Expired' : `${days}d left`}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${status === 'expired' ? 'bg-red-400' : status === 'expiring' ? 'bg-accent-500' : status === 'extended' ? 'bg-sky-500' : 'bg-brand-500'}`}
                          style={{ width: `${Math.max(0, Math.min(100, (days / (totalMonths * 30)) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <ProductDetailSheet
          product={selected}
          onClose={() => setSelected(null)}
          onExtend={onExtend}
        />
      )}
    </div>
  );
}

function ProductDetailSheet({ product, onClose, onExtend }: { product: Product; onClose: () => void; onExtend: (p: Product, plan: ExtensionPlan) => void }) {
  const [showExtension, setShowExtension] = useState(false);
  const status = getWarrantyStatus(product);
  const days = daysUntil(product.warrantyExpiry);
  const cfg = warrantyStatusConfig[status];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed bottom-0 lg:inset-0 lg:flex lg:items-center lg:justify-center left-1/2 -translate-x-1/2 lg:translate-x-0 w-full max-w-md lg:max-w-lg z-50 bg-white rounded-t-3xl lg:rounded-3xl animate-slide-up max-h-[88vh] overflow-y-auto scrollbar-hide safe-bottom">
        <div className="sticky top-0 bg-white pt-3 pb-2 z-10 lg:pt-4">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-200 lg:hidden" />
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
                <ProductIcon name={product.icon} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{product.name}</h3>
                <p className="text-xs text-slate-500">{product.brand} · {product.category}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 shrink-0">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Warranty status banner */}
          <div className={`rounded-2xl ${cfg.bg} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-semibold ${cfg.text}`}>Warranty status</p>
                <p className={`text-xl font-extrabold ${cfg.text} mt-0.5`}>
                  {days < 0 ? 'Expired' : days === 0 ? 'Expires today' : `${days} days left`}
                </p>
              </div>
              <WarrantyStatusBadge status={status} />
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/50 overflow-hidden">
              <div
                className={`h-full rounded-full ${cfg.dot}`}
                style={{ width: `${Math.max(0, Math.min(100, (days / ((product.originalWarrantyMonths + product.extendedMonths) * 30)) * 100))}%` }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-3">
            <DetailRow icon={Calendar} label="Purchase date" value={formatDate(product.purchaseDate)} />
            <DetailRow icon={Calendar} label="Warranty expiry" value={formatDate(product.warrantyExpiry)} />
            <DetailRow icon={ShieldPlus} label="Coverage" value={`${product.originalWarrantyMonths + product.extendedMonths} months${product.extendedMonths > 0 ? ` (+${product.extendedMonths} extended)` : ''}`} />
            <DetailRow icon={Store} label="Retailer" value={product.retailer} />
            <DetailRow icon={Hash} label="Serial number" value={product.serialNumber} mono />
          </div>

          {/* Extend button */}
          {status !== 'expired' || true ? (
            <button
              onClick={() => setShowExtension(true)}
              className="w-full mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 font-semibold text-sm py-3.5 active:scale-95 transition-transform"
            >
              <ShieldPlus className="h-4 w-4" />
              {product.extendedMonths > 0 ? 'Extend warranty further' : 'Buy extended warranty'}
            </button>
          ) : null}
        </div>
      </div>

      {showExtension && (
        <ExtensionSheet
          product={product}
          onClose={() => setShowExtension(false)}
          onSelect={(plan) => {
            onExtend(product, plan);
            setShowExtension(false);
            onClose();
          }}
        />
      )}
    </>
  );
}

function ExtensionSheet({ product, onClose, onSelect }: { product: Product; onClose: () => void; onSelect: (plan: ExtensionPlan) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60] animate-fade-in" onClick={onClose} />
      <div className="fixed bottom-0 lg:inset-0 lg:flex lg:items-center lg:justify-center left-1/2 -translate-x-1/2 lg:translate-x-0 w-full max-w-md lg:max-w-2xl z-[70] bg-white rounded-t-3xl lg:rounded-3xl animate-slide-up max-h-[85vh] overflow-y-auto scrollbar-hide safe-bottom">
        <div className="sticky top-0 bg-white pt-3 pb-2 z-10 lg:pt-4">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-200 lg:hidden" />
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-slate-900">Extended warranty</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-4">Protect your {product.name} beyond the standard coverage.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {extensionPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left rounded-2xl border-2 p-4 transition-all relative ${
                  selectedPlan === plan.id ? 'border-brand-500 bg-brand-50' : 'border-slate-100 bg-white'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-accent-500 text-white text-[10px] font-bold px-2.5 py-1">
                    BEST VALUE
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{plan.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{plan.months} months additional coverage</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-600">{plan.months} months</p>
                    <p className="text-xs text-slate-400 mt-0.5">added coverage</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <button
            disabled={!selectedPlan}
            onClick={() => {
              const plan = extensionPlans.find((p) => p.id === selectedPlan);
              if (plan) onSelect(plan);
            }}
            className={`w-full mt-5 rounded-xl font-semibold text-sm py-3.5 transition-all ${
              selectedPlan ? 'bg-brand-600 text-white active:scale-95' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {selectedPlan ? 'Purchase extension' : 'Select a plan'}
          </button>
        </div>
      </div>
    </>
  );
}

function DetailRow({ icon: Icon, label, value, mono }: { icon: typeof Calendar; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5 text-slate-500">
        <Icon className="h-4 w-4 text-slate-400" />
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-sm font-semibold text-slate-800 ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}
