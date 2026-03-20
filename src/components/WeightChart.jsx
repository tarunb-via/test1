import { format } from 'date-fns';

export default function WeightChart({ entries }) {
  if (!entries.length) {
    return <div className="flex h-72 items-center justify-center rounded-3xl bg-cream-50 text-base text-slate-500">No entries yet. Add your first weigh-in to see your trend.</div>;
  }

  const points = [...entries].sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)).slice(-10);
  const weights = points.map((entry) => entry.weight);
  const min = Math.min(...weights) - 1;
  const max = Math.max(...weights) + 1;
  const width = 100;
  const height = 220;

  const path = points.map((entry, index) => {
    const x = (index / Math.max(points.length - 1, 1)) * width;
    const y = height - ((entry.weight - min) / (max - min || 1)) * height;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-cream-50 p-4">
        <svg viewBox={`0 0 ${width} ${height + 10}`} className="h-72 w-full overflow-visible">
          <defs>
            <linearGradient id="weightLine" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((line) => <line key={line} x1="0" x2={width} y1={(height / 3) * line} y2={(height / 3) * line} stroke="#d6e4e1" strokeDasharray="2 4" />)}
          <path d={path} fill="none" stroke="url(#weightLine)" strokeWidth="2.5" strokeLinecap="round" />
          {points.map((entry, index) => {
            const x = (index / Math.max(points.length - 1, 1)) * width;
            const y = height - ((entry.weight - min) / (max - min || 1)) * height;
            return <circle key={entry.id} cx={x} cy={y} r="2.8" fill="#0f766e" />;
          })}
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {points.slice(-5).map((entry) => (
          <div key={entry.id} className="rounded-2xl bg-white p-3 shadow-sm">
            <p className="text-sm text-slate-500">{format(new Date(entry.recordedAt), 'MMM d')}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{entry.weight.toFixed(1)} lb</p>
          </div>
        ))}
      </div>
    </div>
  );
}
