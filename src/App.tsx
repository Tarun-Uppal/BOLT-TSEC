import { useState, useCallback } from 'react';
import type { TabId, Product, Claim, ExtensionPlan } from './types';
import { products as initialProducts, claims as initialClaims } from './data';
import { Dashboard } from './components/Dashboard';
import { Claims } from './components/Claims';
import { Products } from './components/Products';
import { Receipts } from './components/Receipts';
import { BottomNav } from './components/BottomNav';
import { Toast, type ToastData } from './components/Toast';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [tab, setTab] = useState<TabId>('dashboard');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);

  const handleExtend = useCallback((product: Product, plan: ExtensionPlan) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              extendedMonths: p.extendedMonths + plan.months,
              warrantyExpiry: new Date(new Date(p.warrantyExpiry).getTime() + plan.months * 30 * 86400000)
                .toISOString()
                .split('T')[0],
            }
          : p
      )
    );
    showToast(`${plan.label} added to ${product.name}`);
  }, [showToast]);

  const handleFileClaim = useCallback((product: Product) => {
    const refNum = `CLM-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const today = new Date().toISOString().split('T')[0];
    const newClaim: Claim = {
      id: `c${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productIcon: product.icon,
      issue: 'New claim filed',
      description: 'Claim filed from dashboard. Details to be provided.',
      status: 'pending',
      filedDate: today,
      updatedDate: today,
      referenceNumber: refNum,
      timeline: [{ date: today, status: 'pending', note: 'Claim submitted via Resolv360.' }],
    };
    setClaims((prev) => [newClaim, ...prev]);
    showToast(`Claim ${refNum} filed for ${product.name}`);
    setTab('claims');
  }, [showToast]);

  const handleUploadReceipt = useCallback((productId: string) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, receiptUploaded: true } : p)));
    const product = products.find((p) => p.id === productId);
    showToast(`Receipt uploaded for ${product?.name ?? 'product'}`);
  }, [products, showToast]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200 bg-white sticky top-0 h-screen">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 leading-none">Resolv360</h1>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Warranty Dashboard</p>
          </div>
        </div>
        <DesktopNav active={tab} onChange={setTab} />
        <div className="mt-auto px-6 py-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-bold">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">John Doe</p>
              <p className="text-xs text-slate-400">john@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-slate-50/90 backdrop-blur-lg px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-900 leading-none">Resolv360</h1>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Warranty Dashboard</p>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-bold">
              JD
            </div>
          </div>
        </header>

        {/* Desktop header bar */}
        <header className="hidden lg:block sticky top-0 z-30 bg-slate-50/90 backdrop-blur-lg px-8 py-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 capitalize">{tab === 'dashboard' ? 'Dashboard' : tab}</h2>
        </header>

        <main className="flex-1 px-5 lg:px-8 pt-2 lg:pt-6 pb-28 lg:pb-8">
          <div className="mx-auto w-full max-w-5xl">
            {tab === 'dashboard' && <Dashboard products={products} claims={claims} onNavigate={setTab} />}
            {tab === 'claims' && <Claims claims={claims} products={products} onFileClaim={handleFileClaim} />}
            {tab === 'products' && <Products products={products} onExtend={handleExtend} />}
            {tab === 'receipts' && <Receipts products={products} onUpload={handleUploadReceipt} />}
          </div>
        </main>
      </div>

      <BottomNav active={tab} onChange={setTab} />
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function DesktopNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  const items: { id: TabId; label: string }[] = [
    { id: 'dashboard', label: 'Home' },
    { id: 'claims', label: 'Claims' },
    { id: 'products', label: 'Products' },
    { id: 'receipts', label: 'Receipts' },
  ];
  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
            active === item.id ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${active === item.id ? 'bg-brand-500' : 'bg-slate-300'}`} />
          {item.label}
        </button>
      ))}
    </nav>
  );
}
