import { useState, useMemo } from 'react';
import type { Product } from '../types';
import { formatDate, getWarrantyStatus } from '../utils';
import { ProductIcon } from './icons';
import { WarrantyStatusBadge } from './StatusBadge';
import { Search, FileText, X, Download, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  products: Product[];
  onUpload: (productId: string) => void;
}

export function Receipts({ products, onUpload }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'uploaded' | 'missing'>('all');

  const filtered = useMemo(() => {
    return products
      .filter((p) => filter === 'all' || (filter === 'uploaded' ? p.receiptUploaded : !p.receiptUploaded))
      .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
  }, [products, search, filter]);

  const uploadedCount = products.filter((p) => p.receiptUploaded).length;
  const missingCount = products.length - uploadedCount;

  const filterChips: { id: typeof filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: products.length },
    { id: 'uploaded', label: 'Uploaded', count: uploadedCount },
    { id: 'missing', label: 'Missing', count: missingCount },
  ];

  return (
    <div className="animate-fade-in pb-4">
      {/* Summary card */}
      <div className="rounded-2xl bg-white border border-slate-100 p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Receipt storage</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{uploadedCount}/{products.length}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1.5 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {uploadedCount} stored
            </div>
            {missingCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-600 bg-accent-50 px-2.5 py-1.5 rounded-full">
                <AlertCircle className="h-3.5 w-3.5" />
                {missingCount} missing
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(uploadedCount / products.length) * 100}%` }} />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search receipts..."
          className="w-full rounded-2xl bg-white border border-slate-200 pl-10 pr-4 py-3 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4">
        {filterChips.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === f.id ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {f.label}
            <span className={`text-xs ${filter === f.id ? 'text-brand-100' : 'text-slate-400'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Receipt cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((product) => (
          <ReceiptCard key={product.id} product={product} onUpload={() => onUpload(product.id)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
            <FileText className="h-7 w-7 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700">No receipts found</p>
        </div>
      )}
    </div>
  );
}

function ReceiptCard({ product, onUpload }: { product: Product; onUpload: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left rounded-2xl bg-white border border-slate-100 p-4 active:scale-[0.98] transition-transform shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
            <ProductIcon name={product.icon} className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-slate-900 truncate">{product.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{product.brand} · {formatDate(product.purchaseDate)}</p>
            <div className="flex items-center justify-between mt-2.5">
              <span className="text-xs text-slate-500">{product.brand}</span>
              {product.receiptUploaded ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Receipt stored
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold text-accent-600 bg-accent-50 px-2.5 py-1 rounded-full">
                  <AlertCircle className="h-3.5 w-3.5" /> Missing
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={() => setOpen(false)} />
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
                    <p className="text-xs text-slate-500">{product.retailer}</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 shrink-0">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              {/* Receipt preview */}
              {product.receiptUploaded ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                  <div className="mx-auto flex h-20 w-16 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100 mb-3">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">receipt_{product.brand.toLowerCase().replace(/\s/g, '')}_{product.purchaseDate}.pdf</p>
                  <p className="text-xs text-slate-400 mt-1">Uploaded {formatDate(product.purchaseDate)}</p>
                  <button className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                    <Download className="h-4 w-4" /> Download
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-accent-200 bg-accent-50 p-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 mb-3">
                    <Upload className="h-7 w-7 text-accent-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">No receipt uploaded</p>
                  <p className="text-xs text-slate-500 mt-1">Upload your receipt to keep it safe and enable faster claims.</p>
                  <button
                    onClick={() => { onUpload(); setOpen(false); }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 active:scale-95 transition-transform"
                  >
                    <Upload className="h-4 w-4" /> Upload receipt
                  </button>
                </div>
              )}

              {/* Purchase details */}
              <div className="mt-4 space-y-3">
                <ReceiptDetailRow label="Product" value={product.name} />
                <ReceiptDetailRow label="Brand" value={product.brand} />
                <ReceiptDetailRow label="Retailer" value={product.retailer} />
                <ReceiptDetailRow label="Purchase date" value={formatDate(product.purchaseDate)} />
                <ReceiptDetailRow label="Serial number" value={product.serialNumber} mono />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm text-slate-500">Warranty status</span>
                  <WarrantyStatusBadge status={getWarrantyStatus(product)} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ReceiptDetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-semibold text-slate-800 ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}
