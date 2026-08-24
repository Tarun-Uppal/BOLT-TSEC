import type { TabId } from '../types';
import { LayoutDashboard, FileText, Package, Receipt } from 'lucide-react';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'claims', label: 'Claims', icon: FileText },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'receipts', label: 'Receipts', icon: Receipt },
];

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-white/90 backdrop-blur-lg border-t border-slate-100 safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex flex-col items-center gap-1 py-1.5 px-4 relative"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                isActive ? 'bg-brand-100 text-brand-600 scale-110' : 'text-slate-400'
              }`}>
                <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
