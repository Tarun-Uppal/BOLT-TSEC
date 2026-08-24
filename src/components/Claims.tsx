import { useState, useMemo } from 'react';
import type { Claim, ClaimStatus, Product } from '../types';
import { formatDate, statusConfig } from '../utils';
import { ProductIcon } from './icons';
import { ClaimStatusBadge } from './StatusBadge';
import { Plus, Search, X, ChevronRight, FileText, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';

interface Props {
  claims: Claim[];
  products: Product[];
  onFileClaim: (product: Product) => void;
}

const filters: { id: ClaimStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'under-review', label: 'Under Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'resolved', label: 'Resolved' },
];

export function Claims({ claims, products, onFileClaim }: Props) {
  const [filter, setFilter] = useState<ClaimStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const filtered = useMemo(() => {
    return claims
      .filter((c) => filter === 'all' || c.status === filter)
      .filter((c) => !search || c.issue.toLowerCase().includes(search.toLowerCase()) || c.productName.toLowerCase().includes(search.toLowerCase()) || c.referenceNumber.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.updatedDate.localeCompare(a.updatedDate));
  }, [claims, filter, search]);

  const fileableProducts = products.filter((p) => {
    const days = Math.round((new Date(p.warrantyExpiry).getTime() - Date.now()) / 86400000);
    return days >= 0;
  });

  return (
    <div className="animate-fade-in pb-4">
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search claims, references..."
          className="w-full rounded-2xl bg-white border border-slate-200 pl-10 pr-4 py-3 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 mb-4">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === f.id ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((claim) => (
            <button
              key={claim.id}
              onClick={() => setSelectedClaim(claim)}
              className="w-full text-left rounded-2xl bg-white border border-slate-100 p-4 active:scale-[0.98] transition-transform shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                  <ProductIcon name={claim.productIcon} className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-sm text-slate-900 truncate">{claim.issue}</p>
                    <ChevronRight className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{claim.productName}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[11px] font-mono text-slate-400">{claim.referenceNumber}</span>
                    <ClaimStatusBadge status={claim.status} size="sm" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {fileableProducts.length > 0 && (
        <FileClaimSheet products={fileableProducts} onFileClaim={onFileClaim} />
      )}

      {selectedClaim && (
        <ClaimDetailSheet claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
        <FileText className="h-7 w-7 text-slate-400" />
      </div>
      <p className="font-semibold text-slate-700">No claims found</p>
      <p className="text-sm text-slate-400 mt-1">Try a different filter or search term.</p>
    </div>
  );
}

function FileClaimSheet({ products, onFileClaim }: { products: Product[]; onFileClaim: (p: Product) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 active:scale-95 transition-transform"
      >
        <Plus className="h-5 w-5" />
        File a claim
      </button>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={() => setOpen(false)} />
          <div className="fixed bottom-0 lg:inset-0 lg:flex lg:items-center lg:justify-center left-1/2 -translate-x-1/2 lg:translate-x-0 w-full max-w-md lg:max-w-lg z-50 bg-white rounded-t-3xl lg:rounded-3xl p-6 animate-slide-up safe-bottom">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Select a product</h3>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">Only products with active warranties can be claimed.</p>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto scrollbar-hide">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setOpen(false); onFileClaim(p); }}
                  className="w-full flex items-center gap-3 rounded-2xl border border-slate-100 p-3.5 text-left active:scale-[0.98] transition-transform hover:border-brand-200"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                    <ProductIcon name={p.icon} className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.brand} · warranty until {formatDate(p.warrantyExpiry)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ClaimDetailSheet({ claim, onClose }: { claim: Claim; onClose: () => void }) {
  const cfg = statusConfig[claim.status];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed bottom-0 lg:inset-0 lg:flex lg:items-center lg:justify-center left-1/2 -translate-x-1/2 lg:translate-x-0 w-full max-w-md lg:max-w-lg z-50 bg-white rounded-t-3xl lg:rounded-3xl animate-slide-up max-h-[88vh] overflow-y-auto scrollbar-hide safe-bottom">
        <div className="sticky top-0 bg-white pt-3 pb-2 z-10 lg:pt-4">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-200 lg:hidden" />
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                <ProductIcon name={claim.productIcon} className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{claim.issue}</h3>
                <p className="text-xs text-slate-500">{claim.productName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 shrink-0">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          <div className={`rounded-2xl ${cfg.bg} p-4 mt-4 flex items-center gap-3`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${cfg.text} bg-white/60`}>
              {claim.status === 'approved' || claim.status === 'resolved' ? <CheckCircle2 className="h-5 w-5" /> : claim.status === 'rejected' ? <XCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            <div>
              <p className={`font-bold text-sm ${cfg.text}`}>{cfg.label}</p>
              <p className="text-xs text-slate-600">Updated {formatDate(claim.updatedDate)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <InfoCard label="Reference" value={claim.referenceNumber} />
            <InfoCard label="Filed date" value={formatDate(claim.filedDate)} />
            <InfoCard label="Product" value={claim.productName} />
            <InfoCard label="Last updated" value={formatDate(claim.updatedDate)} />
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-slate-700 leading-relaxed">{claim.description}</p>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Timeline</p>
            <div className="space-y-0">
              {claim.timeline.map((event, i) => {
                const evtCfg = statusConfig[event.status];
                const isLast = i === claim.timeline.length - 1;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${evtCfg.bg} ${evtCfg.text} shrink-0 z-10`}>
                        {event.status === 'approved' || event.status === 'resolved' ? <CheckCircle2 className="h-4 w-4" /> : event.status === 'rejected' ? <XCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      {!isLast && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                    </div>
                    <div className={`pb-4 ${isLast ? 'pb-0' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${evtCfg.text}`}>{evtCfg.label}</span>
                        <span className="text-xs text-slate-400">{formatDate(event.date)}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{event.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button className="flex-1 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm py-3 active:scale-95 transition-transform">
              <Eye className="h-4 w-4 inline mr-1.5" /> Track
            </button>
            <button className="flex-1 rounded-xl bg-brand-600 text-white font-semibold text-sm py-3 active:scale-95 transition-transform">
              Contact support
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-slate-800 mt-1 break-words">{value}</p>
    </div>
  );
}
