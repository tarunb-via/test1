import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Boxes, MapPin, PackageSearch, RefreshCw, ShieldCheck, TrendingUp } from 'lucide-react';
import StatCard from './components/StatCard';
import InventoryTable from './components/InventoryTable';

export default function App() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItems = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get('/api/items');
      setItems(data);
      setSelectedId((current) => current ?? data[0]?.id ?? null);
    } catch {
      setError('Unable to load inventory right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) =>
      [item.name, item.category, item.sku, item.location].some((value) => value.toLowerCase().includes(normalized))
    );
  }, [items, query]);

  const selectedItem = filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0] ?? null;

  const stats = useMemo(() => {
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockCount = items.filter((item) => item.quantity <= item.reorderLevel).length;
    const categories = new Set(items.map((item) => item.category)).size;
    return { totalUnits, lowStockCount, categories };
  }, [items]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(30,64,175,0.16),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef4fb_100%)] text-slate-900">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-5 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-5 py-8 text-white shadow-xl shadow-brand-900/20 sm:px-6 md:px-8 md:py-10"
        >
          <div className="grid gap-8 md:grid-cols-[1.4fr_0.9fr] md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Live inventory visibility
              </div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Know exactly how much stock you have for every item.</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-50 sm:text-lg">
                Search your catalog, spot low-stock products instantly, and check where each item is stored before you reorder.
              </p>
            </div>
            <div className="rounded-[28px] bg-white/12 p-5 backdrop-blur-sm ring-1 ring-white/20">
              <label htmlFor="inventory-search" className="text-sm font-semibold text-brand-50">Search inventory</label>
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-lg">
                <PackageSearch className="h-5 w-5 text-brand-600" />
                <input
                  id="inventory-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try: espresso beans, cups, freezer"
                  className="min-h-[44px] w-full border-none bg-transparent text-base outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={loadItems}
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 py-3 text-base font-semibold text-brand-700 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98]"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh stock
              </button>
            </div>
          </div>
        </motion.div>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard icon={Boxes} label="Total units on hand" value={stats.totalUnits} tone="bg-brand-50 text-brand-700" />
          <StatCard icon={TrendingUp} label="Categories tracked" value={stats.categories} tone="bg-accent-50 text-accent-700" />
          <StatCard icon={PackageSearch} label="Items needing reorder" value={stats.lowStockCount} tone="bg-sand-100 text-sand-700" />
        </section>

        {loading ? (
          <div className="rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-brand-100">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-brand-600" />
            <p className="mt-4 text-base font-medium text-slate-600">Loading your inventory dashboard…</p>
          </div>
        ) : error ? (
          <div className="rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-rose-100">
            <p className="text-lg font-semibold text-rose-700">{error}</p>
            <button
              onClick={loadItems}
              className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-rose-600 px-5 py-3 text-base font-semibold text-white transition hover:brightness-110"
            >
              Try again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-brand-100">
            <p className="text-lg font-semibold text-slate-900">No items matched “{query}”.</p>
            <p className="mt-2 text-base text-slate-600">Search by item name, category, SKU, or storage location.</p>
          </div>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
            <InventoryTable items={filteredItems} selectedId={selectedItem?.id} onSelect={setSelectedId} />

            <motion.aside
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-brand-100"
            >
              {selectedItem ? (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Selected item</p>
                      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{selectedItem.name}</h2>
                      <p className="mt-1 text-base text-slate-500">SKU {selectedItem.sku}</p>
                    </div>
                    <div className="rounded-2xl bg-brand-50 px-4 py-3 text-right text-brand-700">
                      <p className="text-sm font-medium">Current stock</p>
                      <p className="text-3xl font-extrabold">{selectedItem.quantity}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-500">Category</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{selectedItem.category}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="h-4 w-4" />
                        <p className="text-sm font-medium">Storage location</p>
                      </div>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{selectedItem.location}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-accent-50 p-4 text-accent-800">
                        <p className="text-sm font-medium">Reorder level</p>
                        <p className="mt-1 text-2xl font-bold">{selectedItem.reorderLevel}</p>
                      </div>
                      <div className="rounded-3xl bg-sand-100 p-4 text-sand-800">
                        <p className="text-sm font-medium">Unit cost</p>
                        <p className="mt-1 text-2xl font-bold">${selectedItem.unitCost.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-brand-900 p-5 text-white">
                      <p className="text-sm font-medium text-brand-100">Stock status</p>
                      <p className="mt-2 text-lg font-semibold">
                        {selectedItem.quantity <= selectedItem.reorderLevel
                          ? 'This item is at or below its reorder point. Plan a replenishment soon.'
                          : 'This item is comfortably stocked and ready for upcoming demand.'}
                      </p>
                    </div>
                  </div>
                </>
              ) : null}
            </motion.aside>
          </section>
        )}
      </section>
    </main>
  );
}
