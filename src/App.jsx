import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle2, Phone, UserRound, Users } from 'lucide-react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get('/api/contacts');
      setContacts(data);
    } catch {
      setError('We could not load submissions right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const { data } = await axios.post('/api/contacts', payload);
      setContacts((current) => [data, ...current]);
      setSuccess('Thanks — your name and phone number were saved.');
    } catch {
      setError('We could not save your details. Please check the form and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-50 text-slate-900">
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 md:py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
                <Users className="h-4 w-4" />
                Quick contact collection
              </div>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-6xl">Let anybody submit their name and phone number in seconds.</h1>
                <p className="max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                  The site now includes a simple public form for collecting contact details, plus a live list of recent submissions.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/12 p-4 shadow-lg backdrop-blur">
                  <UserRound className="h-6 w-6" />
                  <p className="mt-3 text-sm text-white/75">Required name field</p>
                </div>
                <div className="rounded-3xl bg-white/12 p-4 shadow-lg backdrop-blur">
                  <Phone className="h-6 w-6" />
                  <p className="mt-3 text-sm text-white/75">Required phone number</p>
                </div>
                <div className="rounded-3xl bg-white/12 p-4 shadow-lg backdrop-blur">
                  <CheckCircle2 className="h-6 w-6" />
                  <p className="mt-3 text-sm text-white/75">Saved instantly</p>
                </div>
              </div>
            </div>

            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-[32px] bg-white p-5 text-slate-900 shadow-soft md:p-6">
              <div className="mb-4 space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Submit your details</h2>
                <p className="text-base text-slate-500">Enter your full name and best phone number below.</p>
              </div>
              <ContactForm onSubmit={handleSubmit} saving={saving} />
              {success ? <p className="mt-4 rounded-2xl bg-accent-50 px-4 py-3 text-base text-accent-700">{success}</p> : null}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-5 md:py-12">
        {error ? (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl bg-rose-100 px-4 py-4 text-base text-rose-700 shadow-sm">
            <span>{error}</span>
            <button onClick={loadContacts} className="min-h-[44px] rounded-full bg-rose-600 px-4 text-white transition hover:brightness-110">
              Retry
            </button>
          </div>
        ) : null}

        <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.15 }} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[28px] bg-white p-5 shadow-soft md:p-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">What this page does</h2>
            <div className="mt-4 space-y-3">
              {[
                'Anybody can enter a name and phone number from the homepage.',
                'Submissions are validated before they are saved.',
                'Recent entries appear below so you can confirm the form works.',
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl bg-cream-50 p-4 shadow-sm">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                  <p className="text-base leading-relaxed text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-soft md:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Recent submissions</h2>
                <p className="text-base text-slate-500">Newest entries appear first.</p>
              </div>
              <div className="rounded-full bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">{contacts.length} total</div>
            </div>
            {loading ? <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-2xl bg-cream-100" />)}</div> : <ContactList contacts={contacts} />}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
