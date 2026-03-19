import clsx from 'clsx';
import { motion } from 'framer-motion';
import { AlertTriangle, Package2 } from 'lucide-react';

export default function InventoryTable({ items, selectedId, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-brand-100"
    >
      <div className="border-b border-brand-100 bg-brand-50/80 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Inventory snapshot</h2>
        <p className="mt-1 text-sm text-slate-600">Tap any item to inspect stock, reorder point, and storage location.</p>
      </div>
      <div className="divide-y divide-brand-100">
        {items.map((item, index) => {
          const lowStock = item.quantity <= item.reorderLevel;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              onClick={() => onSelect(item.id)}
              className={clsx(
                'flex min-h-[44px] w-full flex-col gap-3 px-5 py-4 text-left transition-all duration-200 hover:bg-brand-50/70 active:scale-[0.99] md:flex-row md:items-center md:justify-between',
                selectedId === item.id && 'bg-brand-50'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-2xl bg-accent-50 p-2 text-accent-700">
                  <Package2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-slate-900">{item.name}</p>
                    <span className="rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sand-700">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">SKU {item.sku} · {item.location}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 md:min-w-[220px] md:justify-end">
                <div>
                  <p className="text-sm text-slate-500">In stock</p>
                  <p className="text-xl font-bold text-slate-900">{item.quantity}</p>
                </div>
                <div className={clsx('inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold', lowStock ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700')}>
                  {lowStock ? <AlertTriangle className="h-4 w-4" /> : null}
                  {lowStock ? 'Reorder soon' : 'Healthy stock'}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
