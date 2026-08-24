import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export interface ToastData {
  id: number;
  message: string;
}

interface Props {
  toast: ToastData | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: Props) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-slide-up w-full max-w-sm px-4">
      <div className="flex items-center gap-3 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-xl">
        <CheckCircle2 className="h-5 w-5 text-brand-400 shrink-0" />
        <p className="text-sm font-semibold flex-1">{toast.message}</p>
        <button onClick={onDismiss} className="p-0.5 rounded-lg hover:bg-white/10">
          <X className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
