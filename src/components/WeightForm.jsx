import { useEffect, useState } from 'react';

const today = new Date().toISOString().slice(0, 10);

export default function WeightForm({ mode = 'entry', onSubmit, saving, initialValues }) {
  const [values, setValues] = useState({ weight: '', recordedAt: today, note: '', targetWeight: '', startingWeight: '', targetDate: '' });

  useEffect(() => {
    if (initialValues) {
      setValues((current) => ({
        ...current,
        targetWeight: initialValues.targetWeight ?? '',
        startingWeight: initialValues.startingWeight ?? '',
        targetDate: initialValues.targetDate ? initialValues.targetDate.slice(0, 10) : '',
      }));
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (mode === 'entry') {
      await onSubmit({ weight: Number(values.weight), recordedAt: values.recordedAt, note: values.note });
      setValues((current) => ({ ...current, weight: '', note: '', recordedAt: today }));
      return;
    }

    await onSubmit({ targetWeight: Number(values.targetWeight), startingWeight: Number(values.startingWeight), targetDate: values.targetDate || null });
  };

  if (mode === 'goal') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2 text-base">
          <span className="font-medium text-white">Starting weight</span>
          <input name="startingWeight" type="number" step="0.1" min="1" value={values.startingWeight} onChange={handleChange} className="min-h-[44px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none" placeholder="185.0" required />
        </label>
        <label className="block space-y-2 text-base">
          <span className="font-medium text-white">Target weight</span>
          <input name="targetWeight" type="number" step="0.1" min="1" value={values.targetWeight} onChange={handleChange} className="min-h-[44px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none" placeholder="170.0" required />
        </label>
        <label className="block space-y-2 text-base">
          <span className="font-medium text-white">Target date</span>
          <input name="targetDate" type="date" value={values.targetDate} onChange={handleChange} className="min-h-[44px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white focus:border-white/40 focus:outline-none" />
        </label>
        <button type="submit" disabled={saving} className="min-h-[44px] w-full rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70">
          {saving ? 'Saving...' : 'Save goal'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-2 text-base">
        <span className="font-medium text-slate-700">Weight (lb)</span>
        <input name="weight" type="number" step="0.1" min="1" value={values.weight} onChange={handleChange} className="min-h-[44px] w-full rounded-2xl bg-cream-50 px-4 text-slate-900 outline-none ring-1 ring-transparent transition focus:ring-brand-300" placeholder="182.4" required />
      </label>
      <label className="block space-y-2 text-base">
        <span className="font-medium text-slate-700">Date</span>
        <input name="recordedAt" type="date" value={values.recordedAt} onChange={handleChange} className="min-h-[44px] w-full rounded-2xl bg-cream-50 px-4 text-slate-900 outline-none ring-1 ring-transparent transition focus:ring-brand-300" required />
      </label>
      <label className="block space-y-2 text-base">
        <span className="font-medium text-slate-700">Notes</span>
        <textarea name="note" rows="4" value={values.note} onChange={handleChange} className="w-full rounded-2xl bg-cream-50 px-4 py-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:ring-brand-300" placeholder="Morning weigh-in after a long walk." />
      </label>
      <button type="submit" disabled={saving} className="min-h-[44px] w-full rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70">
        {saving ? 'Saving...' : 'Add weigh-in'}
      </button>
    </form>
  );
}
