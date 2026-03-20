import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, ArrowDown, ArrowUp, CalendarDays, Scale, Target, TrendingUp } from 'lucide-react';
import { format, subDays } from 'date-fns';
import clsx from 'clsx';
import StatCard from './components/StatCard';
import WeightForm from './components/WeightForm';
import WeightChart from './components/WeightChart';
import EntryList from './components/EntryList';

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function App() {
  const [entries, setEntries] = useState([]);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [{ data: entriesData }, { data: goalData }] = await Promise.all([
        axios.get('/api/entries'),
        axios.get('/api/goal'),
      ]);
      setEntries(entriesData);
      setGoal(goalData);
    } catch {
      setError('We could not load your weight history right now. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = useMemo(() => {
    if (!entries.length) {
      return {
        latest: null,
        previous: null,
        weeklyChange: 0,
        totalChange: 0,
        progress: 0,
      };
    }

    const sorted = [...entries].sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));
    const latest = sorted.at(-1);
    const weekStart = subDays(new Date(latest.recordedAt), 7);
    const weekEntry = [...sorted].reverse().find((entry) => new Date(entry.recordedAt) <= weekStart) ?? sorted[0];
    const first = sorted[0];
    const totalChange = Number((latest.weight - first.weight).toFixed(1));
    const weeklyChange = Number((latest.weight - weekEntry.weight).toFixed(1));

    let progress = 0;
    if (goal?.targetWeight && goal?.startingWeight && goal.startingWeight !== goal.targetWeight) {
      const totalDistance = Math.abs(goal.startingWeight - goal.targetWeight);
      const covered = totalDistance - Math.abs(latest.weight - goal.targetWeight);
      progress = Math.max(0, Math.min(100, Math.round((covered / totalDistance) * 100)));
    }

    return { latest, weeklyChange, totalChange, progress };
  }, [entries, goal]);

  const handleAddEntry = async (payload) => {
    try {
      setSaving(true);
      setError('');
      const { data } = await axios.post('/api/entries', payload);
      setEntries((current) => [data, ...current].sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)));
    } catch {
      setError('Your new weigh-in could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleGoalSave = async (payload) => {
    try {
      setSaving(true);
      setError('');
      const { data } = await axios.post('/api/goal', payload);
      setGoal(data);
    } catch {
      setError('We could not update your goal just now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-50 text-slate-900">
      <section className="bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-5 md:py-14">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              <Activity className="h-4 w-4" />
              Daily weight tracking with momentum insights
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-6xl">PulseWeight keeps your progress clear, calm, and motivating.</h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                Log weigh-ins, watch your trend line, and stay focused on steady progress instead of noisy day-to-day swings.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }} className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white/12 p-5 shadow-lg backdrop-blur">
              <p className="text-sm text-white/75">Latest weigh-in</p>
              <p className="mt-2 text-3xl font-bold">{metrics.latest ? `${metrics.latest.weight.toFixed(1)} lb` : '--'}</p>
              <p className="mt-2 text-sm text-white/80">
                {metrics.latest ? `Logged ${format(new Date(metrics.latest.recordedAt), 'MMM d, yyyy')}` : 'Add your first entry to begin'}
              </p>
            </div>
            <div className="rounded-3xl bg-white/12 p-5 shadow-lg backdrop-blur">
              <p className="text-sm text-white/75">Goal progress</p>
              <p className="mt-2 text-3xl font-bold">{goal?.targetWeight ? `${metrics.progress}%` : '--'}</p>
              <p className="mt-2 text-sm text-white/80">{goal?.targetWeight ? `Targeting ${goal.targetWeight.toFixed(1)} lb` : 'Set a target to unlock progress tracking'}</p>
            </div>
            <div className="rounded-3xl bg-white/12 p-5 shadow-lg backdrop-blur">
              <p className="text-sm text-white/75">7-day trend</p>
              <p className="mt-2 flex items-center gap-2 text-3xl font-bold">
                {metrics.weeklyChange <= 0 ? <ArrowDown className="h-7 w-7" /> : <ArrowUp className="h-7 w-7" />}
                {entries.length ? `${Math.abs(metrics.weeklyChange).toFixed(1)} lb` : '--'}
              </p>
              <p className="mt-2 text-sm text-white/80">A quick read on your recent direction</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-5 md:py-10">
        {error ? (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl bg-rose-100 px-4 py-4 text-base text-rose-700 shadow-sm">
            <span>{error}</span>
            <button onClick={loadData} className="min-h-[44px] rounded-full bg-rose-600 px-4 text-white transition hover:brightness-110">
              Retry
            </button>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={Scale} label="Current weight" value={metrics.latest ? `${metrics.latest.weight.toFixed(1)} lb` : '--'} tone="brand" />
              <StatCard icon={TrendingUp} label="Total change" value={entries.length ? `${metrics.totalChange > 0 ? '+' : ''}${metrics.totalChange.toFixed(1)} lb` : '--'} tone={metrics.totalChange <= 0 ? 'accent' : 'sunset'} />
              <StatCard icon={CalendarDays} label="Entries logged" value={String(entries.length)} tone="brand" helper={entries.length ? `Since ${format(new Date(entries.at(-1)?.recordedAt ?? new Date()), 'MMM d')}` : 'Start today'} />
              <StatCard icon={Target} label="Goal weight" value={goal?.targetWeight ? `${goal.targetWeight.toFixed(1)} lb` : '--'} tone="accent" helper={goal?.targetDate ? `By ${format(new Date(goal.targetDate), 'MMM d, yyyy')}` : 'Optional target date'} />
            </div>

            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.15 }} className="rounded-[28px] bg-white p-5 shadow-soft md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Trend overview</h2>
                  <p className="text-base text-slate-500">See how your weight is moving over time.</p>
                </div>
                <div className="rounded-full bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">Last 10 entries</div>
              </div>
              {loading ? <div className="h-72 animate-pulse rounded-3xl bg-cream-100" /> : <WeightChart entries={entries} />}
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.2 }} className="rounded-[28px] bg-white p-5 shadow-soft md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Recent weigh-ins</h2>
                  <p className="text-base text-slate-500">A quick journal of your latest entries and notes.</p>
                </div>
              </div>
              {loading ? <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-2xl bg-cream-100" />)}</div> : <EntryList entries={entries} />}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-[28px] bg-white p-5 shadow-soft md:p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Log today&apos;s weight</h2>
                <p className="text-base text-slate-500">Capture your weigh-in and any context that matters.</p>
              </div>
              <WeightForm onSubmit={handleAddEntry} saving={saving} />
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.18 }} className="rounded-[28px] bg-slate-950 p-5 text-white shadow-soft md:p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight">Goal settings</h2>
                <p className="text-base text-white/70">Set a destination and let PulseWeight measure the distance.</p>
              </div>
              <WeightForm mode="goal" onSubmit={handleGoalSave} saving={saving} initialValues={goal} />
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.24 }} className="rounded-[28px] bg-accent-50 p-5 shadow-soft md:p-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Momentum tips</h2>
              <div className="mt-4 space-y-3">
                {['Weigh in at the same time each day for cleaner trends.', 'Use notes to capture sleep, sodium, or workouts that may affect fluctuations.', 'Focus on weekly averages instead of single-day spikes.'].map((tip) => (
                  <div key={tip} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
                    <div className={clsx('mt-1 h-2.5 w-2.5 rounded-full', 'bg-accent-500')} />
                    <p className="text-base leading-relaxed text-slate-600">{tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
