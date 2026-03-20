import { motion } from 'framer-motion';
import clsx from 'clsx';

const tones = {
  brand: 'bg-brand-50 text-brand-700',
  accent: 'bg-accent-50 text-accent-700',
  sunset: 'bg-sunset-50 text-sunset-700',
};

export default function StatCard({ icon: Icon, label, value, helper, tone = 'brand' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[24px] bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
        </div>
        <div className={clsx('rounded-2xl p-3', tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
