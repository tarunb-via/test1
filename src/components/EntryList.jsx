import { formatDistanceToNow, format } from 'date-fns';

export default function EntryList({ entries }) {
  if (!entries.length) {
    return <div className="rounded-3xl bg-cream-50 p-6 text-base text-slate-500">No weigh-ins yet. Add one to start building your history.</div>;
  }

  return (
    <div className="space-y-3">
      {entries.slice(0, 6).map((entry) => (
        <div key={entry.id} className="rounded-3xl bg-cream-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-slate-900">{entry.weight.toFixed(1)} lb</p>
              <p className="text-sm text-slate-500">{format(new Date(entry.recordedAt), 'EEEE, MMM d')}</p>
            </div>
            <p className="text-sm text-slate-400">{formatDistanceToNow(new Date(entry.recordedAt), { addSuffix: true })}</p>
          </div>
          {entry.note ? <p className="mt-3 text-base leading-relaxed text-slate-600">{entry.note}</p> : null}
        </div>
      ))}
    </div>
  );
}
